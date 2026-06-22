import { db } from "@/lib/db";
import { google } from "googleapis";
import { encryptText, decryptText } from "@/lib/crypto";

/**
 * Retrieves a fresh Google OAuth2 client with automatically rotated tokens if expired.
 * 
 * @param userId - ID of the local User
 * @returns An authenticated google.auth.OAuth2 client, or null if no integration exists
 */
export async function getFreshClient(userId: string) {
  const tokenRecord = await db.googleToken.findUnique({
    where: { userId },
  });

  if (!tokenRecord) {
    return null;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback";

  if (!clientId || !clientSecret) {
    throw new Error("Missing Google Client ID or Secret in environment configuration.");
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  // Decrypt saved tokens
  const accessToken = decryptText(tokenRecord.accessToken);
  const refreshToken = decryptText(tokenRecord.refreshToken);
  const expiresAt = new Date(tokenRecord.expiresAt);

  // If token is expired or expires in the next 5 minutes, trigger rotation
  const isExpired = expiresAt.getTime() - Date.now() < 5 * 60 * 1000;

  if (isExpired) {
    console.log(`[Google OAuth Refresh] Access token for user ${userId} expired. Rotating...`);
    try {
      oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      const { credentials } = await oauth2Client.refreshAccessToken();
      const newAccessToken = credentials.access_token;
      
      if (!newAccessToken) {
        throw new Error("Token refresh response did not include a new access token.");
      }

      // Google may return a new refresh token, fallback to current if not provided
      const newRefreshToken = credentials.refresh_token || refreshToken;
      const newExpiryTime = credentials.expiry_date || Date.now() + 3600 * 1000;
      const newExpiresAt = new Date(newExpiryTime);

      // Encrypt and update the refreshed tokens in the SQLite database
      await db.googleToken.update({
        where: { userId },
        data: {
          accessToken: encryptText(newAccessToken),
          refreshToken: encryptText(newRefreshToken),
          expiresAt: newExpiresAt,
        },
      });

      oauth2Client.setCredentials({
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expiry_date: newExpiryTime,
      });

      return oauth2Client;
    } catch (error) {
      console.error(`[Google OAuth Refresh] Failed to refresh token for user ${userId}:`, error);
      throw error;
    }
  }

  // Token is still valid, load existing credentials
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiresAt.getTime(),
  });

  return oauth2Client;
}

/**
 * Pushes a local event to the user's Google Calendar.
 * 
 * @param userId - ID of the local User
 * @param eventId - ID of the local Event to push
 */
export async function pushEventToGoogle(userId: string, eventId: string): Promise<void> {
  console.log(`[Google Calendar Sync] pushEventToGoogle called: userId=${userId}, eventId=${eventId}`);
  try {
    const auth = await getFreshClient(userId);
    if (!auth) {
      console.log(`[Google Calendar Sync] User ${userId} is not integrated with Google Calendar.`);
      return;
    }
    // Foundational mock implementation to use auth in calendar API call
    const calendar = google.calendar({ version: "v3", auth });
    // Future sync API integration can go here
  } catch (error) {
    console.error(`[Google Calendar Sync] Error pushing event:`, error);
  }
}

/**
 * Pulls events from the user's Google Calendar and updates local events.
 * 
 * @param userId - ID of the local User
 */
export async function pullEventsFromGoogle(userId: string): Promise<void> {
  console.log(`[Google Calendar Sync] pullEventsFromGoogle called: userId=${userId}`);
  try {
    const auth = await getFreshClient(userId);
    if (!auth) {
      console.log(`[Google Calendar Sync] User ${userId} is not integrated with Google Calendar.`);
      return;
    }
    // Foundational mock implementation to use auth in calendar API call
    const calendar = google.calendar({ version: "v3", auth });
    // Future sync API integration can go here
  } catch (error) {
    console.error(`[Google Calendar Sync] Error pulling events:`, error);
  }
}
