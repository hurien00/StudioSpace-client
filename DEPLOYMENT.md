# Deploying StudioSpace

StudioSpace has two deployable pieces:

| Piece | Directory | Recommended host |
| --- | --- | --- |
| Next.js frontend + Better Auth | `C:\ph\studio_space` | Vercel |
| Express + MongoDB API | `C:\ph\stdio_space server` | Vercel (second project) |

The frontend and API **must be deployed separately**. The frontend talks to the
API through `NEXT_PUBLIC_API_URL`, and the API verifies JWTs against the
frontend's Better Auth JWKS endpoint.

---

## 1. Backend (Express API) → Vercel

The backend already contains the Vercel entry point (`api/index.js`) and
`vercel.json`, so it can be imported as its own Vercel project.

1. Create/import a Vercel project from `C:\ph\stdio_space server`.
2. Add the environment variables:

   | Key | Value |
   | --- | --- |
   | `MONGODB_URI` | MongoDB Atlas connection string |
   | `BETTER_AUTH_SECRET` | Same secret as the frontend |
   | `BETTER_AUTH_URL` | `https://<backend-project>.vercel.app` |
   | `CLIENT_URL` | `https://<frontend-project>.vercel.app` |

   `CLIENT_URL` accepts a comma-separated list, so preview deployments can be
   added too:
   `https://studio-space.vercel.app,https://studio-space-git-main-you.vercel.app`

3. Deploy and note the public URL (for example
   `https://studio-space-backend.vercel.app`).
4. Sanity check: `https://<backend>/` should return
   `{"message":"StudioSpace Server is running fine"}`.

> The API reads the JWKS from `${CLIENT_URL}/api/auth/jwks`, so the frontend
> must be deployed (or at least reachable) before protected endpoints work.

---

## 2. Frontend (Next.js) → Vercel

1. Import `C:\ph\studio_space` as a Vercel project.
2. Add the environment variables:

   | Key | Value |
   | --- | --- |
   | `BETTER_AUTH_URL` | `https://<frontend-project>.vercel.app` |
   | `BETTER_AUTH_SECRET` | Same secret as the backend |
   | `MONGODB_URI` | MongoDB Atlas connection string |
   | `GOOGLE_CLIENT_ID` | Google OAuth client ID |
   | `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
   | `NEXT_PUBLIC_API_URL` | `https://<backend-project>.vercel.app` |

   `NEXT_PUBLIC_*` values are **inlined at build time**. If the backend URL
   changes, update `NEXT_PUBLIC_API_URL` and redeploy the frontend.

3. Deploy.

### Required production settings

- **Better Auth URL:** `BETTER_AUTH_URL` must be the exact public frontend URL
  (no trailing slash). Google OAuth and session cookies depend on it.
- **Google OAuth redirect URI:** add to Google Cloud Console → Credentials:
  - `https://<frontend-project>.vercel.app/api/auth/callback/google`
  - Keep `http://localhost:3000/api/auth/callback/google` for local dev.
- **Google authorized origin:** `https://<frontend-project>.vercel.app`
- **OAuth consent screen:** if it is still in *Testing* mode, add every Google
  account that should be allowed to sign in as a test user, or publish the app.
- **MongoDB Atlas:** allow Vercel's dynamic IPs. The simplest option is
  Network Access → `0.0.0.0/0` (restrict credentials appropriately), or use
  Atlas' Vercel integration.
- **Secrets:** generate `BETTER_AUTH_SECRET` with
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  and use the **same value** in both projects.

---

## 3. Deploy order (recommended)

1. Deploy the **backend** first and copy its URL.
2. Deploy the **frontend** with `NEXT_PUBLIC_API_URL` pointing at the backend.
3. Set the backend's `CLIENT_URL` to the frontend URL and redeploy it.
4. Add the production Google redirect URI/origin and redeploy the frontend if
   Google credentials were just added.
5. Sign in with email/password and Google, then test:
   - add a studio
   - edit / delete one of your listings
   - create a booking and cancel it

All protected requests send `Authorization: Bearer <jwt>`; the API returns
`401` for missing/invalid tokens.

---

## 4. Local development

Frontend:

```bash
cd C:\ph\studio_space
npm install
npm run dev
```

Backend:

```bash
cd "C:\ph\stdio_space server"
npm install
npm start
```

Copy `.env.example` to `.env` in each directory and fill in the values.

---

## 5. Notes / limits

- `next.config.ts` sets `images.unoptimized = true` because studio photos are
  user-supplied URLs from arbitrary hosts. This avoids `next/image` rejecting
  unknown hosts. Switch to `images.remotePatterns` if you want Vercel's image
  optimizer and can constrain image hosts.
- Vercel preview deployments have unique URLs. Google OAuth requires each
  redirect URI to be registered explicitly; add preview URLs only if you need
  Google login on previews. Alternatively, use a custom domain for production.
- The frontend and backend each open their own MongoDB connection. On Vercel
  serverless this is cached per warm instance, which is fine for normal usage.
