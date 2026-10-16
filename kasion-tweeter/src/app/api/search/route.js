import { NextResponse } from 'next/server';
import db from '@/lib/db';
import twitterClient from '@/lib/twitter';
import crypto from 'crypto';

// Seed mock tweets for search in demo mode
const MOCK_TWEETS_POOL = [
  {
    id: 't_1',
    text: 'Next.js 15 App Router handles params asynchronously now. This is a game changer for server components! #nextjs #webdev',
    created_at: '2026-07-04T18:32:00Z',
    author: {
      username: 'next_js_fanatic',
      name: 'Lee Robinson Jr.',
      profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop'
    },
    public_metrics: { like_count: 320, retweet_count: 45, reply_count: 12 }
  },
  {
    id: 't_2',
    text: 'Building a local twitter dashboard using Antigravity and SQLite. The developer experience is absolutely seamless.',
    created_at: '2026-07-05T02:15:00Z',
    author: {
      username: 'dev_lawrence',
      name: 'Lawrence C.',
      profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop'
    },
    public_metrics: { like_count: 89, retweet_count: 14, reply_count: 3 }
  },
  {
    id: 't_3',
    text: 'Can anyone recommend the best way to handle OAuth 1.0a signatures in Node.js without heavy external libraries? 🛠️',
    created_at: '2026-07-03T10:45:00Z',
    author: {
      username: 'node_architect',
      name: 'Sarah Chen',
      profile_image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop'
    },
    public_metrics: { like_count: 12, retweet_count: 2, reply_count: 8 }
  },
  {
    id: 't_4',
    text: 'Just hit 10k followers! Thank you so much to everyone who reads my web development and AI updates. Cheers! 🎉',
    created_at: '2026-07-05T06:00:00Z',
    author: {
      username: 'coding_trends',
      name: 'Code Explorer',
      profile_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop'
    },
    public_metrics: { like_count: 1540, retweet_count: 320, reply_count: 98 }
  },
  {
    id: 't_5',
    text: 'Is it just me or is vanilla CSS making a massive comeback? Container queries, `:has()`, and scroll animations are incredible native APIs.',
    created_at: '2026-07-04T12:00:00Z',
    author: {
      username: 'css_wizard',
      name: 'Style Maven',
      profile_image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop'
    },
    public_metrics: { like_count: 752, retweet_count: 112, reply_count: 42 }
  }
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'saved';

    if (action === 'saved') {
      const queries = db.prepare("SELECT * FROM saved_queries ORDER BY created_at DESC").all();
      const parsedQueries = queries.map(q => ({
        ...q,
        query_params: JSON.parse(q.query_params)
      }));
      return NextResponse.json({ success: true, queries: parsedQueries });
    }

    if (action === 'run') {
      const rawQuery = searchParams.get('q');
      if (!rawQuery) {
        return NextResponse.json({ success: false, error: 'Query string "q" is required.' }, { status: 400 });
      }

      const isConfigured = twitterClient.isConfigured();
      if (!isConfigured) {
        // Return filtered mock results in demo mode
        const qLower = rawQuery.toLowerCase();
        const results = MOCK_TWEETS_POOL.filter(t => 
          t.text.toLowerCase().includes(qLower) || 
          t.author.username.toLowerCase().includes(qLower) ||
          t.author.name.toLowerCase().includes(qLower)
        );

        // If no filter matches, return all pool items as representative
        const finalResults = results.length > 0 ? results : MOCK_TWEETS_POOL;

        return NextResponse.json({
          success: true,
          tweets: finalResults,
          demo: true,
          query: rawQuery
        });
      }

      // Run live query using X API
      const apiResponse = await twitterClient.searchRecent(rawQuery);
      
      // Parse X API structure to standard flat format for our UI
      const usersMap = {};
      if (apiResponse.includes?.users) {
        apiResponse.includes.users.forEach(u => {
          usersMap[u.id] = u;
        });
      }

      const tweets = (apiResponse.data || []).map(t => {
        const author = usersMap[t.author_id] || {
          username: 'unknown',
          name: 'Unknown Author',
          profile_image_url: ''
        };

        return {
          id: t.id,
          text: t.text,
          created_at: t.created_at,
          author: {
            username: author.username,
            name: author.name,
            profile_image_url: author.profile_image_url
          },
          public_metrics: {
            like_count: t.public_metrics?.like_count || 0,
            retweet_count: t.public_metrics?.retweet_count || 0,
            reply_count: t.public_metrics?.reply_count || 0
          }
        };
      });

      return NextResponse.json({ success: true, tweets, demo: false, query: rawQuery });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, queryParams } = data; // queryParams is an object containing builders (from, keyword, etc.)

    if (!name || !queryParams) {
      return NextResponse.json({ success: false, error: 'Name and queryParams are required.' }, { status: 400 });
    }

    const queryId = crypto.randomUUID();
    db.prepare("INSERT INTO saved_queries (id, name, query_params) VALUES (?, ?, ?)")
      .run(queryId, name, JSON.stringify(queryParams));

    return NextResponse.json({ success: true, id: queryId, message: 'Query saved successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Query ID is required.' }, { status: 400 });
    }

    db.prepare("DELETE FROM saved_queries WHERE id = ?").run(id);
    return NextResponse.json({ success: true, message: 'Query deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
