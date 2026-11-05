export interface AuthUser {
  name: string;
  email: string;
  image?: string;
  photoURL?: string;
}

export const AUTH_COOKIE_NAME = "authToken";
export const AUTH_CHANGE_EVENT = "auth-change";

// Keep the cookie alive for 7 days
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function setAuthCookie(value = "authenticated") {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(
    value
  )}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
}

/**
 * Asks the Next.js auth route to exchange the Better Auth session for a JWT
 * stored in an HTTPOnly cookie. The cookie is then sent automatically to the
 * Express API (localhost:8000) on every credentialed request.
 */
export async function ensureAuthToken(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const res = await fetch("/api/auth/jwt-cookie", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });

    return res.ok;
  } catch {
    return false;
  }
}

/** Clears the HTTPOnly JWT cookie when the user signs out. */
export async function clearAuthToken() {
  if (typeof window === "undefined") return;

  try {
    await fetch("/api/auth/jwt-cookie", {
      method: "DELETE",
      credentials: "include",
    });
  } catch {
    // The local session is cleared regardless of this request.
  }
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("user");
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function saveUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
  setAuthCookie(user.email || "authenticated");
  notifyAuthChange();
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
  clearAuthCookie();
  notifyAuthChange();
}

export function notifyAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}
