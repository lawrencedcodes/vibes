import { NextResponse } from 'next/server';
import db from '@/lib/db';
import twitterClient from '@/lib/twitter';

// Seed mock connections if DB is empty to provide a playground
function seedMockConnections() {
  const row = db.prepare("SELECT COUNT(*) as count FROM account_connections").get();
  if (row.count > 0) return;

  const now = new Date();
  
  const mockUsers = [
    {
      user_id: 'm_1',
      username: 'airdrop_gainz',
      name: 'Solana Airdrop Bot 💸',
      connection_type: 'follower',
      followers_count: 12,
      following_count: 1850,
      tweet_count: 24900,
      account_created_at: '2026-02-15T00:00:00Z',
      last_tweet_at: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(), // 2 hrs ago
      is_spam: 1,
      is_inactive: 0,
      relationship_status: 'active'
    },
    {
      user_id: 'm_2',
      username: 'bob_inactive_99',
      name: 'Bob Jenkins',
      connection_type: 'following',
      followers_count: 142,
      following_count: 210,
      tweet_count: 89,
      account_created_at: '2018-05-12T00:00:00Z',
      last_tweet_at: '2025-01-10T12:00:00Z', // Inactive (long ago)
      is_spam: 0,
      is_inactive: 1,
      relationship_status: 'active'
    },
    {
      user_id: 'm_3',
      username: 'crypto_shill_vip',
      name: 'Web3 Alpha Hunter 💎',
      connection_type: 'both',
      followers_count: 45,
      following_count: 980,
      tweet_count: 5600,
      account_created_at: '2025-11-01T00:00:00Z',
      last_tweet_at: new Date(now.getTime() - 12 * 3600 * 1000).toISOString(),
      is_spam: 1,
      is_inactive: 0,
      relationship_status: 'active'
    },
    {
      user_id: 'm_4',
      username: 'alice_code',
      name: 'Alice Dev',
      connection_type: 'both',
      followers_count: 2450,
      following_count: 620,
      tweet_count: 1240,
      account_created_at: '2021-08-20T00:00:00Z',
      last_tweet_at: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(), // 1 day ago
      is_spam: 0,
      is_inactive: 0,
      relationship_status: 'active'
    },
    {
      user_id: 'm_5',
      username: 'ghost_coder',
      name: 'The Ghost',
      connection_type: 'following',
      followers_count: 15,
      following_count: 95,
      tweet_count: 1,
      account_created_at: '2022-03-01T00:00:00Z',
      last_tweet_at: '2024-08-15T00:00:00Z', // Inactive
      is_spam: 0,
      is_inactive: 1,
      relationship_status: 'active'
    },
    {
      user_id: 'm_6',
      username: 'free_promos_xx',
      name: 'DM FOR ADVERTS 🔞',
      connection_type: 'follower',
      followers_count: 9,
      following_count: 4500,
      tweet_count: 154000,
      account_created_at: '2026-05-01T00:00:00Z',
      last_tweet_at: new Date(now.getTime() - 1000 * 60).toISOString(), // 1 min ago
      is_spam: 1,
      is_inactive: 0,
      relationship_status: 'active'
    },
    {
      user_id: 'm_7',
      username: 'tech_expert_9',
      name: 'Tech Enthusiast',
      connection_type: 'follower',
      followers_count: 850,
      following_count: 790,
      tweet_count: 3200,
      account_created_at: '2020-01-15T00:00:00Z',
      last_tweet_at: new Date(now.getTime() - 48 * 3600 * 1000).toISOString(),
      is_spam: 0,
      is_inactive: 0,
      relationship_status: 'active'
    },
    {
      user_id: 'm_8',
      username: 'lost_account',
      name: 'Forgotten User',
      connection_type: 'following',
      followers_count: 2,
      following_count: 350,
      tweet_count: 12,
      account_created_at: '2017-09-09T00:00:00Z',
      last_tweet_at: '2023-11-22T08:00:00Z',
      is_spam: 0,
      is_inactive: 1,
      relationship_status: 'active'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO account_connections 
    (user_id, username, name, connection_type, followers_count, following_count, tweet_count, account_created_at, last_tweet_at, is_spam, is_inactive, relationship_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction((users) => {
    for (const u of users) {
      stmt.run(
        u.user_id,
        u.username,
        u.name,
        u.connection_type,
        u.followers_count,
        u.following_count,
        u.tweet_count,
        u.account_created_at,
        u.last_tweet_at,
        u.is_spam,
        u.is_inactive,
        u.relationship_status
      );
    }
  });

  transaction(mockUsers);
}

export async function GET() {
  try {
    // If not configured and database is empty, seed mock data
    if (!twitterClient.isConfigured()) {
      seedMockConnections();
    } else {
      // Clear mock accounts if credentials are now loaded
      db.prepare("DELETE FROM account_connections WHERE user_id LIKE 'm_%'").run();
    }
    
    const accounts = db.prepare("SELECT * FROM account_connections WHERE relationship_status = 'active' ORDER BY username ASC").all();
    
    return NextResponse.json({ success: true, accounts, demo: !twitterClient.isConfigured() });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const isConfigured = twitterClient.isConfigured();
    if (!isConfigured) {
      // In demo mode, trigger a mock reload of data
      db.prepare("DELETE FROM account_connections").run();
      seedMockConnections();
      const accounts = db.prepare("SELECT * FROM account_connections WHERE relationship_status = 'active'").all();
      return NextResponse.json({ success: true, accounts, demo: true, message: 'Playground synced with mock auditor data.' });
    }

    // Clear mock accounts to start clean on configured sync
    db.prepare("DELETE FROM account_connections WHERE user_id LIKE 'm_%'").run();

    const myId = twitterClient.getMyUserId();
    if (!myId) {
      return NextResponse.json({ success: false, error: 'TWITTER_USER_ID is required to sync circle.' }, { status: 400 });
    }

    // 1. Fetch Followers
    let followers = [];
    let followersError = null;
    try {
      let response = await twitterClient.getFollowers(myId);
      followers = followers.concat(response.data || []);
      // Fetch up to 2 pages if exists
      if (response.meta?.next_token) {
        response = await twitterClient.getFollowers(myId, response.meta.next_token);
        followers = followers.concat(response.data || []);
      }
    } catch (e) {
      console.warn("Failed fetching followers", e);
      followersError = e.message;
    }

    // 2. Fetch Following
    let following = [];
    let followingError = null;
    try {
      let response = await twitterClient.getFollowing(myId);
      following = following.concat(response.data || []);
      // Fetch up to 2 pages if exists
      if (response.meta?.next_token) {
        response = await twitterClient.getFollowing(myId, response.meta.next_token);
        following = following.concat(response.data || []);
      }
    } catch (e) {
      console.warn("Failed fetching following list", e);
      followingError = e.message;
    }

    // If both failed, return a transparent diagnostic error or degrade gracefully to Sandbox
    if (followers.length === 0 && following.length === 0 && (followersError || followingError)) {
      const is403 = (followersError && (followersError.includes('403') || followersError.includes('Client Forbidden'))) || 
                    (followingError && (followingError.includes('403') || followingError.includes('Client Forbidden')));
      
      if (is403) {
        console.warn("[X API Circle Route] 403 Forbidden detected. Seeding mock connections for Sandbox Fallback Mode.");
        seedMockConnections();
        const accounts = db.prepare("SELECT * FROM account_connections WHERE relationship_status = 'active' ORDER BY username ASC").all();
        return NextResponse.json({ 
          success: true, 
          accounts, 
          demo: true, 
          sandboxFallback: true,
          message: 'Swapped to local sandbox due to X API Free Tier restrictions (403 Forbidden).' 
        });
      }

      return NextResponse.json({ 
        success: false, 
        error: `Failed to fetch from X API. Followers Error: "${followersError}". Following Error: "${followingError}". Please check your Developer Portal permissions and verify that TWITTER_USER_ID matches your account numeric ID.` 
      }, { status: 502 });
    }

    // 3. Merge accounts into dictionary
    const merged = {};

    followers.forEach(u => {
      merged[u.id] = {
        id: u.id,
        username: u.username,
        name: u.name,
        connection_type: 'follower',
        followers_count: u.public_metrics?.followers_count || 0,
        following_count: u.public_metrics?.following_count || 0,
        tweet_count: u.public_metrics?.tweet_count || 0,
        account_created_at: u.created_at || null,
        // In basic list we don't get last tweet, estimate/default it or leave null
        last_tweet_at: null, 
      };
    });

    following.forEach(u => {
      if (merged[u.id]) {
        merged[u.id].connection_type = 'both';
      } else {
        merged[u.id] = {
          id: u.id,
          username: u.username,
          name: u.name,
          connection_type: 'following',
          followers_count: u.public_metrics?.followers_count || 0,
          following_count: u.public_metrics?.following_count || 0,
          tweet_count: u.public_metrics?.tweet_count || 0,
          account_created_at: u.created_at || null,
          last_tweet_at: null,
        };
      }
    });

    // 4. Calculate Heuristics
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 3600 * 1000);

    const usersToInsert = Object.values(merged).map(u => {
      const folRatio = u.following_count > 0 ? (u.followers_count / u.following_count) : 0;
      
      // Heuristic 1: Spam detection
      // - Extremely low followers but following a ton
      // - Name contains suspicious words
      const lowFollowerRatio = folRatio < 0.08 && u.following_count > 200;
      const spamName = /(bot|shill|gain|airdrop|promo|dm for|click here|crypto|trade|rich)/i.test(u.name) || /(bot|crypto|shill|gain)/i.test(u.username);
      const isSpam = (lowFollowerRatio || spamName) ? 1 : 0;

      // Heuristic 2: Inactivity detection
      // Since X API lists don't easily provide last tweet date, if we have tweet_count = 0 it's inactive.
      // We can also check account age (if created long ago but has < 5 tweets, likely inactive).
      let isInactive = 0;
      if (u.tweet_count === 0) {
        isInactive = 1;
      } else if (u.account_created_at) {
        const createdDate = new Date(u.account_created_at);
        const ageInDays = (now.getTime() - createdDate.getTime()) / (24 * 3600 * 1000);
        if (ageInDays > 365 && u.tweet_count < 10) {
          isInactive = 1;
        }
      }

      return {
        ...u,
        isSpam,
        isInactive
      };
    });

    // 5. Update Database
    // Keep existing states (e.g. muted/unfollowed) where applicable, otherwise merge
    const checkStmt = db.prepare("SELECT relationship_status FROM account_connections WHERE user_id = ?");
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO account_connections 
      (user_id, username, name, connection_type, followers_count, following_count, tweet_count, account_created_at, last_tweet_at, is_spam, is_inactive, relationship_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((users) => {
      for (const u of users) {
        const existing = checkStmt.get(u.id);
        const status = existing ? existing.relationship_status : 'active';
        
        insertStmt.run(
          u.id,
          u.username,
          u.name,
          u.connection_type,
          u.followers_count,
          u.following_count,
          u.tweet_count,
          u.account_created_at,
          u.last_tweet_at,
          u.isSpam,
          u.isInactive,
          status
        );
      }
    });

    transaction(usersToInsert);

    const accounts = db.prepare("SELECT * FROM account_connections WHERE relationship_status = 'active'").all();
    return NextResponse.json({ success: true, accounts, demo: false });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Bulk Actions (Mute / Unfollow)
export async function DELETE(req) {
  try {
    const data = await req.json();
    const { userIds, action } = data; // action: 'unfollow' or 'mute'

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ success: false, error: 'No userIds provided for bulk action.' }, { status: 400 });
    }

    const isDemo = !twitterClient.isConfigured();
    const results = [];

    for (const userId of userIds) {
      try {
        if (!isDemo) {
          if (action === 'unfollow') {
            await twitterClient.unfollowUser(userId);
          } else if (action === 'mute') {
            await twitterClient.muteUser(userId);
          }
        }

        // Update database relationship status
        const status = action === 'unfollow' ? 'unfollowed' : 'muted';
        db.prepare("UPDATE account_connections SET relationship_status = ?, fetched_at = CURRENT_TIMESTAMP WHERE user_id = ?")
          .run(status, userId);

        results.push({ userId, success: true });
      } catch (err) {
        console.error(`Failed bulk ${action} for ${userId}:`, err);
        results.push({ userId, success: false, error: err.message });
      }
    }

    return NextResponse.json({ success: true, results, action, demo: isDemo });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
