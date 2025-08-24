import { NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  // 1. Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
      code,
    }),
  });

  const tokens = await tokenRes.json();

  // 2. Fetch email identity
  const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const profile = await profileRes.json();

  // 3. Save in DB (pseudo code)
  // await db.accounts.insert({
  //   userId: currentUserId,   // from your session/JWT
  //   provider: "google",
  //   email: profile.email,
  //   accessToken: tokens.access_token,
  //   refreshToken: tokens.refresh_token,
  //   expiresAt: Date.now() + tokens.expires_in * 1000,
  // });

  return NextResponse.json({ connected: true, email: profile.email });
}
