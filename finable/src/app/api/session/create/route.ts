import { NextResponse } from "next/server";
import { SignJWT } from "jose";

// Clave secreta (usa un valor seguro en producción, ej: process.env.JWT_SECRET)
const secret = new TextEncoder().encode(process.env.JWT_PRIVATE_KEY || "super_secret_key");

export async function POST(req: Request) {
  try {
    const { telefono } = await req.json();

    if (!telefono) {
      return NextResponse.json({ error: "Falta el teléfono" }, { status: 400 });
    }

    // Fecha de expiración (ej: 1h)
    const expiresInSeconds = 60 * 60; // 1 hora
    const expirationDate = Math.floor(Date.now() / 1000) + expiresInSeconds;

    // Crear JWT
    const token = await new SignJWT({ telefono })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(expirationDate)
      .sign(secret);

    // Crear respuesta y setear cookie segura
    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: "session",
      value: token,
      httpOnly: true, // no accesible desde JS
      secure: process.env.NODE_ENV === "production", // solo https en prod
      sameSite: "strict",
      path: "/",
      maxAge: expiresInSeconds,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creando sesión" }, { status: 500 });
  }
}
