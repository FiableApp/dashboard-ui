import { NextResponse } from "next/server";

const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID!;
const MICROSOFT_REDIRECT_URI = process.env.MICROSOFT_REDIRECT_URI!;

// Scopes: offline_access = refresh token, User.Read = identity, Mail.Read = inbox
const SCOPES = ["offline_access", "User.Read", "Mail.Read"].join(" ");

export async function GET() {
  const url = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/authorize");
  url.searchParams.set("client_id", MICROSOFT_CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", MICROSOFT_REDIRECT_URI);
  url.searchParams.set("response_mode", "query");
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("prompt", "consent"); // ensures refresh token is always returned

  return NextResponse.redirect(url.toString());
}
