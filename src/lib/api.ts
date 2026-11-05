/**
 * Base URL of the Express API.
 *
 * Local development defaults to localhost:8000. In production set
 * `NEXT_PUBLIC_API_URL` (for example `https://studio-space-backend.vercel.app`)
 * in the Vercel project settings. `NEXT_PUBLIC_*` values are inlined at build
 * time, so the variable must exist before the production build runs.
 */
const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000";

export const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

/** Joins the API base URL with a path such as `/api/studios`. */
export function apiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
