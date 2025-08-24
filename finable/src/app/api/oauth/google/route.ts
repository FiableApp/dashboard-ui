import { NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

// ✅ Only include valid Gmail scopes here
const SCOPES = [
  "https://mail.google.com" // useful to identify the account
].join(" ");

export async function GET() {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", SCOPES);

  // ✅ These are not scopes, but query params!
  url.searchParams.set("access_type", "offline"); // ask for refresh token
  url.searchParams.set("prompt", "consent");      // force consent screen → ensures refresh token

  return NextResponse.redirect(url.toString());
}
