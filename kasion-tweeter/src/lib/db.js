import Database from 'better-sqlite3';
import path from 'path';

// Store sqlite database in the project root
const dbPath = path.resolve(process.cwd(), 'db.sqlite');
const db = new Database(dbPath);

// Initialize/migrate schema
db.exec(`
  CREATE TABLE IF NOT EXISTS saved_queries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    query_params TEXT NOT NULL, -- JSON string
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS monitored_keywords (
    id TEXT PRIMARY KEY,
    keyword TEXT UNIQUE NOT NULL,
    last_polled_at TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS monitored_tweets (
    tweet_id TEXT PRIMARY KEY,
    keyword_id TEXT,
    text TEXT,
    author_id TEXT,
    author_username TEXT,
    author_name TEXT,
    created_at TEXT,
    likes INTEGER DEFAULT 0,
    retweets INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    is_read INTEGER DEFAULT 0,
    FOREIGN KEY(keyword_id) REFERENCES monitored_keywords(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tweet_performance (
    tweet_id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    retweets INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    profile_clicks INTEGER DEFAULT 0,
    published_at TEXT,
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS account_connections (
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    name TEXT NOT NULL,
    connection_type TEXT NOT NULL, -- 'follower', 'following', 'both'
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    tweet_count INTEGER DEFAULT 0,
    account_created_at TEXT,
    last_tweet_at TEXT,
    is_spam INTEGER DEFAULT 0,
    is_inactive INTEGER DEFAULT 0,
    relationship_status TEXT DEFAULT 'active', -- 'active', 'muted', 'unfollowed'
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posted_tweets (
    tweet_id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_connections_username ON account_connections(username);
  CREATE INDEX IF NOT EXISTS idx_monitored_tweets_keyword ON monitored_tweets(keyword_id);
`);

export default db;
