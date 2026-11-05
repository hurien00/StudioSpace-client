export interface AuthUser {
  name: string;
  email: string;
  image?: string;
  photoURL?: string;
}

export const AUTH_COOKIE_NAME = "authToken";
export const AUTH_CHANGE_EVENT = "auth-change";


let memoryToken: string | null = null;

export function getAuthToken(): string | null {
  return memoryToken;
}

// Keep the cookie alive for 7 days
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function setAuthCookie(value = "authenticated") {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(
    value
  )}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
}

export async function ensureAuthToken(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const res = await fetch("/api/auth/jwt-cookie", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      memoryToken = null;
      return false;
    }

    const data = (await res.json().catch(() => null)) as {
      token?: string;
    } | null;

    memoryToken = typeof data?.token === "string" ? data.token : null;

    return Boolean(memoryToken);
  } catch {
    memoryToken = null;
    return false;
  }
}


export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  if (!memoryToken) {
    await ensureAuthToken();
  }

  const buildInit = (): RequestInit => {
    const headers = new Headers(init.headers);

    if (memoryToken) {
      headers.set("Authorization", `Bearer ${memoryToken}`);
    }

    return { ...init, headers, credentials: "include" };
  };

  let res = await fetch(input, buildInit());

  if (res.status === 401) {
    memoryToken = null;

    if (await ensureAuthToken()) {
      res = await fetch(input, buildInit());
    }
  }

  return res;
}

export async function clearAuthToken() {
  memoryToken = null;

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
