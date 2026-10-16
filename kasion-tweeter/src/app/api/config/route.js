import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import twitterClient from '@/lib/twitter';

export async function GET() {
  const isConfigured = twitterClient.isConfigured();
  
  return NextResponse.json({
    configured: isConfigured,
    userId: twitterClient.getMyUserId() || null,
    envValues: {
      TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY || '',
      TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET || '',
      TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN || '',
      TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
      TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN || '',
      TWITTER_USER_ID: process.env.TWITTER_USER_ID || '',
      TWITTER_USER_HANDLE: process.env.TWITTER_USER_HANDLE || ''
    }
  });
}

export async function POST(req) {
  try {
    const data = await req.json();
    const envPath = path.resolve(process.cwd(), '.env');
    
    // Construct .env content
    const lines = [
      `# Twitter/X API Developer Credentials`,
      `TWITTER_CONSUMER_KEY=${data.TWITTER_CONSUMER_KEY || ''}`,
      `TWITTER_CONSUMER_SECRET=${data.TWITTER_CONSUMER_SECRET || ''}`,
      `TWITTER_ACCESS_TOKEN=${data.TWITTER_ACCESS_TOKEN || ''}`,
      `TWITTER_ACCESS_TOKEN_SECRET=${data.TWITTER_ACCESS_TOKEN_SECRET || ''}`,
      `TWITTER_BEARER_TOKEN=${data.TWITTER_BEARER_TOKEN || ''}`,
      `TWITTER_USER_ID=${data.TWITTER_USER_ID || ''}`,
      `TWITTER_USER_HANDLE=${data.TWITTER_USER_HANDLE || ''}`
    ];
    
    fs.writeFileSync(envPath, lines.join('\n'), 'utf8');
    
    // Update process.env dynamically for the running server instance
    process.env.TWITTER_CONSUMER_KEY = data.TWITTER_CONSUMER_KEY;
    process.env.TWITTER_CONSUMER_SECRET = data.TWITTER_CONSUMER_SECRET;
    process.env.TWITTER_ACCESS_TOKEN = data.TWITTER_ACCESS_TOKEN;
    process.env.TWITTER_ACCESS_TOKEN_SECRET = data.TWITTER_ACCESS_TOKEN_SECRET;
    process.env.TWITTER_BEARER_TOKEN = data.TWITTER_BEARER_TOKEN;
    process.env.TWITTER_USER_ID = data.TWITTER_USER_ID;
    process.env.TWITTER_USER_HANDLE = data.TWITTER_USER_HANDLE;
    
    return NextResponse.json({ success: true, message: 'Environment variables updated. Restart may be needed for some module instances.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
