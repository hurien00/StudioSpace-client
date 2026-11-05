# StudioSpace

**Peer-to-peer creative workspace & production studio sharing platform.**

Creators, filmmakers, photographers, podcasters and musicians can discover studios by the hour, check amenities and host details, and reserve a slot without phone calls. Studio owners can publish and manage their own listings.

| | |
| --- | --- |
| **Live website** | https://studio-space-bice.vercel.app |
| **Live API** | https://studio-space-backend-two.vercel.app |
| **Client repository** | https://github.com/hurien00/StudioSpace |
| **Server repository** | https://github.com/hurien00/StudioSpace-server |

## Examiner test credentials

Email and password sign-in is enabled. No email verification is required.

```text
Email:    examiner@studiospace.app
Password: Examiner123
```

You can also register a new account from [/register](https://studio-space-bice.vercel.app/register). Passwords must contain an uppercase letter, a lowercase letter and at least 6 characters.

## Key features

- **Dynamic marketplace** — the home page hero slider, featured studios (`.limit(6)`) and all studio cards are fetched from MongoDB. Category cards open `/studios` with the category pre-selected.
- **Full studio CRUD** — add a studio with image upload (ImgBB) or a direct URL, amenities, capacity, security deposit and read-only owner details; edit or delete only your own listings with a confirmation modal.
- **Booking workflow** — the studio detail page has a gallery lightbox, amenities, host card, reviews and a "Book Workspace Now" modal. Bookings are saved with status `Pending`, appear in My Bookings with Pending / Confirmed / Completed / Cancelled badges, and can be cancelled.
- **Double-booking prevention** — before inserting a booking the API checks overlapping `Pending` / `Confirmed` reservations for the same studio and date and rejects collisions with `409` and a clear message.
- **JWT security** — Better Auth issues a JWT that the API verifies against `${CLIENT_URL}/api/auth/jwks`. Protected mutations (`POST /api/studios`, `PUT/DELETE /api/studios/[id]`, `POST /api/bookings`, `GET /api/bookings`, cancel) return `401` without a valid token, and ownership checks return `403` for other users' records. The browser sends `Authorization: Bearer <jwt>`; the token is also stored in an HTTPOnly `studio_token` cookie.
- **Authentication** — Better Auth + MongoDB adapter with email/password and Google sign-in, password validation, redirect back to the requested private route, and a profile dropdown (Dashboard, Add New Studio, My Studio Listings, My Bookings, Logout).
- **Theme switching** — light/dark toggle persisted in `localStorage` with no flash on reload.
- **Polished UX** — Sonner toasts everywhere (no `alert()`), custom 404 illustration, skeleton loaders, empty states, responsive grids with equal-height cards, custom X logo, and legal pages.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/Base UI, Swiper, Sonner |
| Auth | Better Auth, MongoDB adapter, JWT (`jose` JWKS verification) |
| Backend | Express 5, Node.js, MongoDB |
| Image uploads | ImgBB API (optional key) or any direct image URL |
| Hosting | Vercel (frontend + API as two projects) |

## Local setup

### 1. Client

```bash
git clone https://github.com/hurien00/StudioSpace.git
cd StudioSpace
npm install
cp .env.example .env
npm run dev
```

`.env` keys:

```env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-long-random-secret
MONGODB_URI=mongodb+srv://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_IMGBB_API_KEY=optional-imgbb-key
```

### 2. Server

```bash
git clone https://github.com/hurien00/StudioSpace-server.git
cd StudioSpace-server
npm install
cp .env.example .env
npm start
```

`.env` keys:

```env
PORT=8000
BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=same-secret-as-the-client
MONGODB_URI=mongodb+srv://...
CLIENT_URL=http://localhost:3000
```

Open http://localhost:3000. The API listens on http://localhost:8000.

### Google sign-in

Add this authorized redirect URI in Google Cloud Console → Credentials:

```text
http://localhost:3000/api/auth/callback/google
https://studio-space-bice.vercel.app/api/auth/callback/google
```

and add `https://studio-space-bice.vercel.app` as an authorized JavaScript origin.

## API routes

| Method | Route | Auth |
| --- | --- | --- |
| GET | `/api/studios` | Public |
| GET | `/api/studios/featured` | Public |
| GET | `/api/studios/:id` | Public |
| GET | `/api/studios/my-listings` | Bearer JWT |
| POST | `/api/studios` | Bearer JWT |
| PUT | `/api/studios/:id` | Bearer JWT + owner |
| DELETE | `/api/studios/:id` | Bearer JWT + owner |
| POST | `/api/bookings` | Bearer JWT + overlap check |
| GET | `/api/bookings` | Bearer JWT (own bookings) |
| PATCH | `/api/bookings/:id/cancel` | Bearer JWT + owner |

Every protected route returns `401 Unauthorized` when the token is missing or invalid.

## Deployment

Both projects are already deployed on Vercel. For a fresh deployment see [`DEPLOYMENT.md`](./DEPLOYMENT.md). In short:

1. Deploy `StudioSpace-server` as a Vercel project with `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` and `CLIENT_URL`.
2. Deploy `StudioSpace` with `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `MONGODB_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_API_URL` and optionally `NEXT_PUBLIC_IMGBB_API_KEY`.
3. Add the production Google redirect URI and authorized origin.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm start        # serve the production build
npm run lint     # ESLint
```
