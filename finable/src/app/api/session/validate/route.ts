import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_PRIVATE_KEY || "super_secret_key");

export async function GET(req: Request) {
  try {
    // Extract cookie "session"
    const cookieHeader = req.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("session="));

    if (!sessionCookie) {
      return NextResponse.json({ error: "No session cookie found" }, { status: 401 });
    }

    const token = sessionCookie.split("=")[1];

    // Verify JWT
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      valid: true,
      data: payload, // contains telefono + iat + exp
    });
  } catch (error) {
    console.error("JWT validation error:", error);
    return NextResponse.json({ valid: false, error: "Invalid or expired token" }, { status: 401 });
  }
}
