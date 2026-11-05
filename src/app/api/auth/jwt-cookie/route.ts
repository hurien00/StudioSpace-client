import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Name of the HTTPOnly cookie that carries the signed JWT to the Express API.
 * Keep this value in sync with `JWT_COOKIE_NAME` in the server project.
 */
const JWT_COOKIE_NAME = "studio_token";

// Mirrors the JWT expiration configured in src/lib/auth.ts (7 days).
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * Exchanges the Better Auth session cookie for a signed JWT and stores that
 * JWT in an HTTPOnly cookie. JavaScript on the page can never read it.
 *
 * Called right after sign-in / sign-up and whenever the login page restores a
 * session from localStorage.
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json(
        { message: "401 Unauthorized: No active session" },
        { status: 401 }
      );
    }

    const { token } = await auth.api.getToken({ headers: request.headers });

    if (!token) {
      return NextResponse.json(
        { message: "Failed to create an access token" },
        { status: 500 }
      );
    }

    // The token is also returned so the client can send it as a Bearer token.
    // It is cached in memory only (never localStorage) and the HTTPOnly cookie
    // remains as a fallback / defense-in-depth mechanism.
    const response = NextResponse.json({ ok: true, token });
    response.cookies.set(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("JWT cookie creation error:", error);
    return NextResponse.json(
      { message: "Failed to create an access token" },
      { status: 500 }
    );
  }
}

/** Clears the JWT cookie on sign-out. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(JWT_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
