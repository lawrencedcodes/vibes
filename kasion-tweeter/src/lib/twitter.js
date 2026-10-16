import crypto from 'crypto';

// Configuration
const CONFIG = {
  get consumerKey() { return process.env.TWITTER_CONSUMER_KEY || ''; },
  get consumerSecret() { return process.env.TWITTER_CONSUMER_SECRET || ''; },
  get accessToken() { return process.env.TWITTER_ACCESS_TOKEN || ''; },
  get accessSecret() { return process.env.TWITTER_ACCESS_TOKEN_SECRET || ''; },
  get bearerToken() { return process.env.TWITTER_BEARER_TOKEN || ''; },
  get myUserId() { return process.env.TWITTER_USER_ID || ''; },
  get myUserHandle() { return process.env.TWITTER_USER_HANDLE || ''; }
};

// Rate Limit and Lock State
const locks = {}; // category -> resetTimestamp (ms)
const queue = [];
let processing = false;

// Helpers for OAuth 1.0a Signature
function rfc3986(str) {
  return encodeURIComponent(str)
    .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

function generateOAuthHeader(method, url, queryParams = {}, bodyParams = {}) {
  if (!CONFIG.consumerKey || !CONFIG.consumerSecret || !CONFIG.accessToken || !CONFIG.accessSecret) {
    throw new Error("Missing OAuth 1.0a credentials in env (TWITTER_CONSUMER_KEY, etc.)");
  }

  const oauthParams = {
    oauth_consumer_key: CONFIG.consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: CONFIG.accessToken,
    oauth_version: '1.0'
  };

  // Combine params for signing
  const allParams = { ...queryParams, ...bodyParams, ...oauthParams };
  const sortedKeys = Object.keys(allParams).sort();
  const paramStrings = sortedKeys.map(k => `${rfc3986(k)}=${rfc3986(allParams[k].toString())}`);
  const parameterString = paramStrings.join('&');

  const signatureBaseString = [
    method.toUpperCase(),
    rfc3986(url),
    rfc3986(parameterString)
  ].join('&');

  const signingKey = `${rfc3986(CONFIG.consumerSecret)}&${rfc3986(CONFIG.accessSecret)}`;
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  oauthParams.oauth_signature = signature;

  const headerParts = Object.keys(oauthParams)
    .sort()
    .map(k => `${rfc3986(k)}="${rfc3986(oauthParams[k])}"`);

  return `OAuth ${headerParts.join(', ')}`;
}

// Queue execution loop
async function processQueue() {
  if (processing) return;
  processing = true;

  while (queue.length > 0) {
    // Find first item whose category is not locked
    const now = Date.now();
    const index = queue.findIndex(item => {
      const lockTime = locks[item.category] || 0;
      return now >= lockTime;
    });

    if (index === -1) {
      // All items are currently locked, wait and check later
      const minLock = Math.min(...Object.values(locks));
      const delay = Math.max(minLock - now, 1000);
      await new Promise(resolve => setTimeout(resolve, delay));
      continue;
    }

    // Extract item
    const [item] = queue.splice(index, 1);
    try {
      const response = await executeRequest(item);
      item.resolve(response);
    } catch (error) {
      if (error.status === 429) {
        // Enqueue back at the start
        const resetHeader = error.headers?.get('x-rate-limit-reset');
        const resetTime = resetHeader ? parseInt(resetHeader) * 1000 + 1000 : Date.now() + 15 * 60 * 1000;
        locks[item.category] = resetTime;
        console.warn(`[X API Queue] 429 Rate Limit for ${item.category}. Locking until ${new Date(resetTime).toLocaleTimeString()}`);
        
        // Put back in queue to try later
        queue.unshift(item);
      } else {
        item.reject(error);
      }
    }

    // Avoid aggressive calling
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  processing = false;
}

// Low-level HTTP Executor
async function executeRequest({ method, url, query, body, useOAuth1, category }) {
  const queryStr = query && Object.keys(query).length > 0
    ? '?' + new URLSearchParams(query).toString()
    : '';
  const fullUrl = url + queryStr;

  const headers = {
    'Accept': 'application/json',
  };

  if (useOAuth1) {
    headers['Authorization'] = generateOAuthHeader(method, url, query, body);
  } else {
    if (!CONFIG.bearerToken) {
      throw new Error("Missing Bearer Token in env (TWITTER_BEARER_TOKEN)");
    }
    headers['Authorization'] = `Bearer ${CONFIG.bearerToken}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  console.log(`[X API Queue] Fetching: ${method} ${fullUrl} [Auth: ${useOAuth1 ? 'OAuth1.0a' : 'Bearer'}]`);
  
  const response = await fetch(fullUrl, options);
  
  // Track rate limits from headers
  const limit = response.headers.get('x-rate-limit-limit');
  const remaining = response.headers.get('x-rate-limit-remaining');
  const reset = response.headers.get('x-rate-limit-reset');

  if (remaining !== null && parseInt(remaining) === 0 && reset) {
    locks[category] = parseInt(reset) * 1000 + 1000;
    console.log(`[X API Queue] Rate limit remaining is 0 for ${category}. Setting lock until reset.`);
  }

  if (!response.ok) {
    const errorBody = await response.text();
    const error = new Error(`Twitter API error: ${response.status} ${response.statusText} - ${errorBody}`);
    error.status = response.status;
    error.headers = response.headers;
    error.body = errorBody;
    throw error;
  }

  return response.json();
}

// Public Enqueue Function
function enqueueRequest(params) {
  return new Promise((resolve, reject) => {
    queue.push({
      ...params,
      resolve,
      reject
    });
    processQueue();
  });
}

// X API Mappings
const twitterClient = {
  // Fetch followers
  async getFollowers(userId, paginationToken = null) {
    const query = {
      'max_results': 100,
      'user.fields': 'created_at,description,profile_image_url,public_metrics'
    };
    if (paginationToken) query.pagination_token = paginationToken;

    return enqueueRequest({
      method: 'GET',
      url: `https://api.twitter.com/2/users/${userId}/followers`,
      query,
      useOAuth1: false,
      category: 'followers'
    });
  },

  // Fetch accounts user is following
  async getFollowing(userId, paginationToken = null) {
    const query = {
      'max_results': 100,
      'user.fields': 'created_at,description,profile_image_url,public_metrics'
    };
    if (paginationToken) query.pagination_token = paginationToken;

    return enqueueRequest({
      method: 'GET',
      url: `https://api.twitter.com/2/users/${userId}/following`,
      query,
      useOAuth1: false,
      category: 'following'
    });
  },

  // Unfollow user (requires OAuth 1.0a)
  async unfollowUser(targetUserId) {
    const myId = CONFIG.myUserId;
    if (!myId) throw new Error("Missing TWITTER_USER_ID in env required for unfollowing");

    return enqueueRequest({
      method: 'DELETE',
      url: `https://api.twitter.com/2/users/${myId}/following/${targetUserId}`,
      useOAuth1: true,
      category: 'unfollow'
    });
  },

  // Mute user (requires OAuth 1.0a)
  async muteUser(targetUserId) {
    const myId = CONFIG.myUserId;
    if (!myId) throw new Error("Missing TWITTER_USER_ID in env required for muting");

    return enqueueRequest({
      method: 'POST',
      url: `https://api.twitter.com/2/users/${myId}/muting`,
      body: { target_user_id: targetUserId },
      useOAuth1: true,
      category: 'mute'
    });
  },

  // Advanced Search (Bearer token)
  async searchRecent(query, maxResults = 50) {
    return enqueueRequest({
      method: 'GET',
      url: 'https://api.twitter.com/2/tweets/search/recent',
      query: {
        query,
        max_results: maxResults,
        'tweet.fields': 'created_at,public_metrics,author_id',
        'expansions': 'author_id',
        'user.fields': 'username,name,profile_image_url'
      },
      useOAuth1: false,
      category: 'search'
    });
  },

  // Get user's own tweets for metrics (Requires Bearer token or OAuth 1.0a)
  async getUserTweets(userId, maxResults = 50) {
    return enqueueRequest({
      method: 'GET',
      url: `https://api.twitter.com/2/users/${userId}/tweets`,
      query: {
        max_results: maxResults,
        'tweet.fields': 'created_at,public_metrics,non_public_metrics,organic_metrics',
        // non_public_metrics and organic_metrics require OAuth 1.0a User context,
        // so we toggle useOAuth1 to true to sign with user credentials to get impression data.
      },
      useOAuth1: true, 
      category: 'user_tweets'
    });
  },

  // Fallback profile lookup (useful to fetch user id if only username is provided)
  async getUserByUsername(username) {
    return enqueueRequest({
      method: 'GET',
      url: `https://api.twitter.com/2/users/by/username/${username}`,
      useOAuth1: false,
      category: 'user_lookup'
    });
  },

  // Post a new tweet (requires OAuth 1.0a User Context, allowed on Free Tier)
  async postTweet(text) {
    return enqueueRequest({
      method: 'POST',
      url: 'https://api.twitter.com/2/tweets',
      body: { text },
      useOAuth1: true,
      category: 'post_tweet'
    });
  },

  // Delete a tweet (requires OAuth 1.0a User Context, allowed on Free Tier)
  async deleteTweet(tweetId) {
    return enqueueRequest({
      method: 'DELETE',
      url: `https://api.twitter.com/2/tweets/${tweetId}`,
      useOAuth1: true,
      category: 'delete_tweet'
    });
  },

  // Fetch own profile details (requires OAuth 1.0a User Context or Bearer, allowed on Free Tier)
  async getMe() {
    return enqueueRequest({
      method: 'GET',
      url: 'https://api.twitter.com/2/users/me',
      query: { 'user.fields': 'profile_image_url' },
      useOAuth1: true,
      category: 'user_me'
    });
  },

  // Returns configuration checks
  isConfigured() {
    return !!(CONFIG.consumerKey && CONFIG.consumerSecret && CONFIG.accessToken && CONFIG.accessSecret && CONFIG.bearerToken && CONFIG.myUserId);
  },

  getMyUserId() {
    return CONFIG.myUserId;
  },

  getMyUserHandle() {
    return CONFIG.myUserHandle;
  }
};

export default twitterClient;
