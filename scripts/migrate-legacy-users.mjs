/**
 * One-off migration: copies accounts from the legacy `users` collection
 * (used by the old Express API) into Better Auth's `user`/`account`
 * collections so those people can sign in with their existing passwords.
 *
 * Better Auth hashes the passwords while importing, and the script is
 * idempotent: accounts that already exist in Better Auth are skipped.
 *
 * Usage (while the Next.js app is running):
 *   node scripts/migrate-legacy-users.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MongoClient } from "mongodb";

// Minimal .env loader so the script works without extra dependencies.
function loadEnv() {
  try {
    const file = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of file.split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const key = match[1];
      let value = match[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      } else {
        value = value.split(" #")[0].trim();
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // No .env file: rely on the real environment.
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
const APP_URL = (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/+$/, "");

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing. Add it to .env or export it first.");
  process.exit(1);
}

const health = await fetch(`${APP_URL}/api/auth/ok`).catch(() => null);
if (!health?.ok) {
  console.error(`Could not reach ${APP_URL}/api/auth/ok. Start the app ("npm run dev") first.`);
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db("stdio_space");

const legacyUsers = await db.collection("users").find({}).toArray();
const migrated = [];
const existing = [];
const skipped = [];
const failed = [];

for (const user of legacyUsers) {
  const email = typeof user.email === "string" ? user.email.trim().toLowerCase() : "";
  const password = typeof user.password === "string" ? user.password : "";

  if (!email || !password) {
    skipped.push(String(user._id));
    continue;
  }

  const response = await fetch(`${APP_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: APP_URL,
    },
    body: JSON.stringify({
      name: user.name || email.split("@")[0],
      email,
      password,
      image: user.photoURL || undefined,
    }),
  });

  const body = await response.json().catch(() => ({}));

  if (response.ok) {
    migrated.push(email);
  } else if (response.status === 422 || /already exists/i.test(body?.message ?? "")) {
    existing.push(email);
  } else {
    failed.push({ email, status: response.status, message: body?.message ?? "unknown error" });
  }
}

await client.close();

console.log(`Legacy users found: ${legacyUsers.length}`);
console.log(`Migrated: ${migrated.length}${migrated.length ? ` (${migrated.join(", ")})` : ""}`);
console.log(`Already in Better Auth: ${existing.length}`);
console.log(`Skipped (missing email/password): ${skipped.length}`);
if (failed.length) {
  console.log(`Failed: ${failed.length}`);
  for (const item of failed) console.log(`  - ${item.email}: ${item.status} ${item.message}`);
  process.exitCode = 1;
}
