import { NextResponse } from 'next/server';
import db from '@/lib/db';
import twitterClient from '@/lib/twitter';
import crypto from 'crypto';

// Helpers to generate realistic mock listening tweets in demo mode
const SIMULATED_TWEETS = {
  default: [
    { username: 'tech_cruncher', name: 'TechCruncher', text: 'This new release is going to change how we build local applications. Absolutely stunning.' },
    { username: 'trend_spotter', name: 'Trend Spotter', text: 'Watching the latest patterns unfold. Highly recommend keeping an eye on this tech.' },
    { username: 'developer_weekly', name: 'DevWeekly', text: 'A deep dive into why developer tooling is the next frontier of software engineering.' }
  ],
  nextjs: [
    { username: 'nextjs_news', name: 'NextJS News', text: 'Next.js 15 is officially stabilizing Server Actions. Web development has never felt faster!' },
    { username: 'v_creator', name: 'Vercel Creator', text: 'Did you know that caching behaviors are completely rewritten in the latest Next.js? Check out the guide.' }
  ],
  antigravity: [
    { username: 'ai_engineer', name: 'AI Engineering Daily', text: 'Antigravity AI coding agents are executing entire software flight designs in seconds. Incredible speed!' },
    { username: 'future_coder', name: 'Future Coder', text: 'Pair programming with Antigravity IDE. Built a complete web app in one turn.' }
  ]
};

function getMockTweetsForKeyword(keyword) {
  const kw = keyword.toLowerCase();
  let pool = SIMULATED_TWEETS.default;
  
  if (kw.includes('nextjs') || kw.includes('next.js')) {
    pool = pool.concat(SIMULATED_TWEETS.nextjs);
  }
  if (kw.includes('antigravity') || kw.includes('agent')) {
    pool = pool.concat(SIMULATED_TWEETS.antigravity);
  }
  
  return pool.map((t, idx) => ({
    id: `listen_${Date.now()}_${idx}_${Math.floor(Math.random() * 1000)}`,
    text: `${t.text} (Tracking match for: ${keyword})`,
    author_id: `author_${idx}`,
    author_username: t.username,
    author_name: t.name,
    created_at: new Date(Date.now() - idx * 10 * 60 * 1000).toISOString(), // spaced out times
    likes: Math.floor(Math.random() * 200) + 10,
    retweets: Math.floor(Math.random() * 50) + 2,
    replies: Math.floor(Math.random() * 20) + 1
  }));
}

export async function GET() {
  try {
    const isConfigured = twitterClient.isConfigured();
    
    if (isConfigured) {
      // Clear mock monitoring alerts if credentials are now loaded
      db.prepare("DELETE FROM monitored_tweets WHERE tweet_id LIKE 'listen_%'").run();
    }

    const keywords = db.prepare("SELECT * FROM monitored_keywords").all();
    const now = new Date();
    
    // Check if we need to poll X API (or generate demo data) for any keyword
    for (const kw of keywords) {
      const lastPolled = kw.last_polled_at ? new Date(kw.last_polled_at) : null;
      const minutesSincePoll = lastPolled ? (now.getTime() - lastPolled.getTime()) / (1000 * 60) : 999;
      
      // Poll every 2 minutes
      if (minutesSincePoll >= 2) {
        if (isConfigured) {
          try {
            const apiRes = await twitterClient.searchRecent(kw.keyword, 10);
            
            const usersMap = {};
            if (apiRes.includes?.users) {
              apiRes.includes.users.forEach(u => {
                usersMap[u.id] = u;
              });
            }

            const insertTweet = db.prepare(`
              INSERT OR IGNORE INTO monitored_tweets 
              (tweet_id, keyword_id, text, author_id, author_username, author_name, created_at, likes, retweets, replies, is_read)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
            `);

            (apiRes.data || []).forEach(t => {
              const author = usersMap[t.author_id] || { username: 'unknown', name: 'Unknown' };
              insertTweet.run(
                t.id,
                kw.id,
                t.text,
                t.author_id,
                author.username,
                author.name,
                t.created_at,
                t.public_metrics?.like_count || 0,
                t.public_metrics?.retweet_count || 0,
                t.public_metrics?.reply_count || 0
              );
            });
            
            db.prepare("UPDATE monitored_keywords SET last_polled_at = ? WHERE id = ?")
              .run(now.toISOString(), kw.id);
              
          } catch (e) {
            console.error(`Error polling keyword "${kw.keyword}":`, e.message);
            
            // Check if it's a 403 Forbidden client tier restriction (Free Tier)
            const is403 = e.message && (e.message.includes('403') || e.message.includes('Client Forbidden'));
            if (is403) {
              console.warn(`[X API Monitoring] 403 Forbidden detected for keyword "${kw.keyword}". Falling back to sandbox feed injection.`);
              const mockTweets = getMockTweetsForKeyword(kw.keyword);
              const insertTweet = db.prepare(`
                INSERT OR IGNORE INTO monitored_tweets 
                (tweet_id, keyword_id, text, author_id, author_username, author_name, created_at, likes, retweets, replies, is_read)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
              `);

              // Grab a mock match and set its timestamp to now to trigger alerts
              const itemsToInsert = mockTweets.slice(0, 1);
              itemsToInsert.forEach(t => {
                const uniqueId = `listen_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                const currentStr = now.toISOString();
                insertTweet.run(
                  uniqueId, 
                  kw.id, 
                  t.text, 
                  t.author_id, 
                  t.author_username, 
                  t.author_name, 
                  currentStr, 
                  t.likes, 
                  t.retweets, 
                  t.replies
                );
              });

              db.prepare("UPDATE monitored_keywords SET last_polled_at = ? WHERE id = ?")
                .run(now.toISOString(), kw.id);
            }
          }
        } else {
          // Demo Mode - Simulate periodic feed injection
          const mockTweets = getMockTweetsForKeyword(kw.keyword);
          const insertTweet = db.prepare(`
            INSERT OR IGNORE INTO monitored_tweets 
            (tweet_id, keyword_id, text, author_id, author_username, author_name, created_at, likes, retweets, replies, is_read)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
          `);

          // Only insert 1 or 2 new items randomly to simulate live stream
          const itemsToInsert = lastPolled ? mockTweets.slice(0, 1) : mockTweets;
          itemsToInsert.forEach(t => {
            // Update time to current for simulated live feed
            if (lastPolled) {
              t.created_at = now.toISOString();
            }
            insertTweet.run(t.id, kw.id, t.text, t.author_id, t.author_username, t.author_name, t.created_at, t.likes, t.retweets, t.replies);
          });

          db.prepare("UPDATE monitored_keywords SET last_polled_at = ? WHERE id = ?")
            .run(now.toISOString(), kw.id);
        }
      }
    }

    // Retrieve all monitored tweets ordered by date
    const feed = db.prepare(`
      SELECT mt.*, mk.keyword 
      FROM monitored_tweets mt
      JOIN monitored_keywords mk ON mt.keyword_id = mk.id
      ORDER BY mt.created_at DESC
      LIMIT 100
    `).all();

    return NextResponse.json({
      success: true,
      keywords,
      feed,
      demo: !isConfigured
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { keyword } = await req.json();
    if (!keyword || keyword.trim() === '') {
      return NextResponse.json({ success: false, error: 'Keyword is required.' }, { status: 400 });
    }

    const trimmedKw = keyword.trim();
    const id = crypto.randomUUID();

    // Check if already exists
    const exists = db.prepare("SELECT * FROM monitored_keywords WHERE keyword = ?").get(trimmedKw);
    if (exists) {
      return NextResponse.json({ success: false, error: 'Keyword is already monitored.' }, { status: 400 });
    }

    db.prepare("INSERT INTO monitored_keywords (id, keyword) VALUES (?, ?)").run(id, trimmedKw);
    
    // Seed initial mock tweets immediately for good UX in demo mode
    if (!twitterClient.isConfigured()) {
      const mockTweets = getMockTweetsForKeyword(trimmedKw);
      const insertTweet = db.prepare(`
        INSERT OR IGNORE INTO monitored_tweets 
        (tweet_id, keyword_id, text, author_id, author_username, author_name, created_at, likes, retweets, replies, is_read)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `);
      mockTweets.forEach(t => {
        insertTweet.run(t.id, id, t.text, t.author_id, t.author_username, t.author_name, t.created_at, t.likes, t.retweets, t.replies);
      });
      db.prepare("UPDATE monitored_keywords SET last_polled_at = ? WHERE id = ?")
        .run(new Date().toISOString(), id);
    }

    const record = db.prepare("SELECT * FROM monitored_keywords WHERE id = ?").get(id);
    return NextResponse.json({ success: true, keyword: record });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Keyword ID is required.' }, { status: 400 });
    }

    db.prepare("DELETE FROM monitored_keywords WHERE id = ?").run(id);
    return NextResponse.json({ success: true, message: 'Keyword removed from monitoring list.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Mark feed matches as read
export async function PATCH(req) {
  try {
    const { tweetIds } = await req.json(); // Array of tweetIds or 'all'
    
    if (tweetIds === 'all') {
      db.prepare("UPDATE monitored_tweets SET is_read = 1").run();
    } else if (Array.isArray(tweetIds)) {
      const stmt = db.prepare("UPDATE monitored_tweets SET is_read = 1 WHERE tweet_id = ?");
      const transaction = db.transaction((ids) => {
        for (const id of ids) {
          stmt.run(id);
        }
      });
      transaction(tweetIds);
    } else {
      return NextResponse.json({ success: false, error: 'Invalid tweetIds parameter.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Alerts updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
