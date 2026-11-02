import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Auth session is mirrored into a cookie by the client (see src/lib/auth-session.ts)
  const token = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  // Define all private routes
  const privateRoutes = [
    "/add-studio",
    "/my-listings",
    "/my-bookings",
    "/studios/edit",
  ];

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing a private route without authentication
  if (isPrivateRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "callbackUrl",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/add-studio/:path*",
    "/my-listings/:path*",
    "/my-bookings/:path*",
    "/studios/edit/:path*",
  ],
};
