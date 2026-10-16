import { NextResponse } from 'next/server';
import db from '@/lib/db';
import twitterClient from '@/lib/twitter';
import crypto from 'crypto';

export async function GET() {
  try {
    const isConfigured = twitterClient.isConfigured();
    let profile = {
      username: 'sandbox_user',
      name: 'Sandbox Account (Free Mode)',
      profile_image_url: ''
    };

    let profileError = null;
    if (isConfigured) {
      // Default to configured user handle for Free Tier fallback lookup
      profile = {
        username: process.env.TWITTER_USER_HANDLE || 'connected_user',
        name: 'Connected Account (Free Tier)',
        profile_image_url: ''
      };
      
      try {
        const response = await twitterClient.getMe();
        if (response.data) {
          profile = {
            username: response.data.username,
            name: response.data.name,
            profile_image_url: response.data.profile_image_url || ''
          };
        }
      } catch (e) {
        console.warn("Failed fetching live profile details", e.message);
        profileError = e.message;
      }
    }

    // Retrieve all locally logged posted tweets
    const posts = db.prepare("SELECT * FROM posted_tweets ORDER BY created_at DESC").all();

    return NextResponse.json({
      success: true,
      profile,
      posts,
      demo: !isConfigured,
      profileError
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text || text.trim() === '') {
      return NextResponse.json({ success: false, error: 'Tweet text cannot be empty.' }, { status: 400 });
    }

    const trimmedText = text.trim();
    const isConfigured = twitterClient.isConfigured();
    
    if (isConfigured) {
      try {
        const res = await twitterClient.postTweet(trimmedText);
        const tweetId = res.data?.id;

        if (tweetId) {
          // Log locally
          db.prepare("INSERT INTO posted_tweets (tweet_id, text) VALUES (?, ?)")
            .run(tweetId, trimmedText);
          
          return NextResponse.json({
            success: true,
            tweet: { tweet_id: tweetId, text: trimmedText, created_at: new Date().toISOString() },
            demo: false
          });
        } else {
          return NextResponse.json({ success: false, error: 'Failed to receive tweet ID from X API.' }, { status: 502 });
        }
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: `X API Post Error: ${error.message}. Please check your App permissions (needs Read & Write) in the Developer Portal.`
        }, { status: 502 });
      }
    } else {
      // Demo Playground Mode - Simulate posting
      const tweetId = `mock_tweet_${Date.now()}`;
      
      db.prepare("INSERT INTO posted_tweets (tweet_id, text) VALUES (?, ?)")
        .run(tweetId, trimmedText);
      
      return NextResponse.json({
        success: true,
        tweet: { tweet_id: tweetId, text: trimmedText, created_at: new Date().toISOString() },
        demo: true
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Tweet ID is required.' }, { status: 400 });
    }

    const isConfigured = twitterClient.isConfigured();

    if (isConfigured) {
      try {
        await twitterClient.deleteTweet(id);
        db.prepare("DELETE FROM posted_tweets WHERE tweet_id = ?").run(id);
        return NextResponse.json({ success: true, demo: false });
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: `X API Delete Error: ${error.message}. Please check your App permissions (needs Read & Write) in the Developer Portal.`
        }, { status: 502 });
      }
    } else {
      // Demo Playground Mode - Delete locally
      db.prepare("DELETE FROM posted_tweets WHERE tweet_id = ?").run(id);
      return NextResponse.json({ success: true, demo: true });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
