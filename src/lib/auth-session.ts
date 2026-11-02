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
