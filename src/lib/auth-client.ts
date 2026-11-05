import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

// In the browser the auth server is always same-origin. During SSR we fall
// back to BETTER_AUTH_URL so production builds never call localhost.
const baseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  (typeof window !== "undefined"
    ? window.location.origin
    : process.env.BETTER_AUTH_URL || "http://localhost:3000");

export const authClient = createAuthClient({
  baseURL,
  plugins: [jwtClient()],
});