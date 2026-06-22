import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";
import { google } from "googleapis";
import { encryptText } from "@/lib/crypto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!code) {
    return NextResponse.redirect(new URL("/planner?sync=error", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback";

  if (!clientId || !clientSecret) {
    return new Response(
      "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment configuration.",
      { status: 500 }
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;
    const expiryDate = tokens.expiry_date; // Unix timestamp in milliseconds

    if (!accessToken) {
      throw new Error("No access token returned from Google OAuth.");
    }

    if (!refreshToken) {
      throw new Error("No refresh token returned. Make sure to revoke access or specify prompt='consent'.");
    }

    // Encrypt both tokens before saving them to the database
    const encryptedAccessToken = encryptText(accessToken);
    const encryptedRefreshToken = encryptText(refreshToken);
    const expiresAt = expiryDate ? new Date(expiryDate) : new Date(Date.now() + 3600 * 1000);

    // Persist securely to the GoogleToken table
    await db.googleToken.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        expiresAt,
      },
      update: {
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        expiresAt,
      },
    });

    return NextResponse.redirect(new URL("/planner?sync=success", request.url));
  } catch (error) {
    console.error("Error exchanging Google OAuth code callback:", error);
    return NextResponse.redirect(new URL("/planner?sync=error", request.url));
  }
}
