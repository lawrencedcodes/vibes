import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";
import { google } from "googleapis";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google";

  if (!clientId || !clientSecret) {
    return new Response(
      "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment configuration. Please configure them in your .env or .env.local file.",
      { status: 500 }
    );
  }

  // Instantiate the Google OAuth2 Client
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  // If no auth code is provided by Google, redirect user to Google consent screen
  if (!code) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar"],
      prompt: "consent",
    });
    return NextResponse.redirect(authUrl);
  }

  // If callback code is present, exchange it for tokens
  try {
    const { tokens } = await oauth2Client.getToken(code);

    // Save the retrieved access and refresh tokens to the database securely
    await db.user.update({
      where: { id: session.userId },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
    });

    // Redirect the user back to the planner page with a success flag
    return NextResponse.redirect(new URL("/planner?sync=success", request.url));
  } catch (error) {
    console.error("Error exchanging Google OAuth code:", error);
    return NextResponse.redirect(new URL("/planner?sync=error", request.url));
  }
}
