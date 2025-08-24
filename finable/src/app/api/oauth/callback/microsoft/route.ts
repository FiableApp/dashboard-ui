import { NextResponse } from "next/server";

const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID!;
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET!;
const MICROSOFT_REDIRECT_URI = process.env.MICROSOFT_REDIRECT_URI!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // 1. Exchange code for tokens
  const tokenRes = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: MICROSOFT_CLIENT_ID,
      client_secret: MICROSOFT_CLIENT_SECRET,
      redirect_uri: MICROSOFT_REDIRECT_URI,
      grant_type: "authorization_code",
      code,
    }),
  });

  const tokens = await tokenRes.json();

  if (tokens.error) {
    return NextResponse.json({ error: tokens.error_description }, { status: 400 });
  }

  // 2. Fetch user identity (email)
  const profileRes = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  const profile = await profileRes.json();

  // 3. Save in DB (pseudo code)
  // await db.accounts.insert({
  //   userId: currentUserId,   // from your JWT/session
  //   provider: "microsoft",
  //   email: profile.userPrincipalName,
  //   accessToken: tokens.access_token,
  //   refreshToken: tokens.refresh_token,
  //   expiresAt: Date.now() + tokens.expires_in * 1000,
  // });

  return NextResponse.json({
    connected: true,
    email: profile.userPrincipalName,
    tokens,
  });
}
