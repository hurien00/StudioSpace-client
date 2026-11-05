/**
 * Removes plaintext passwords from the legacy `users` collection.
 *
 * Those credentials were migrated to Better Auth's `user`/`account`
 * collections (hashed). Before deleting anything, this script verifies that
 * every legacy account exists in Better Auth with a credential account, so no
 * one is locked out. Safe to run more than once.
 *
 * Usage:
 *   node scripts/remove-legacy-passwords.mjs           # apply
 *   node scripts/remove-legacy-passwords.mjs --dry-run # preview only
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MongoClient } from "mongodb";

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

const dryRun = process.argv.includes("--dry-run");
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing. Add it to .env or export it first.");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db("stdio_space");

const legacyUsers = await db
  .collection("users")
  .find({ password: { $exists: true } })
  .toArray();

const problems = [];
const clearable = [];

for (const legacy of legacyUsers) {
  const email =
    typeof legacy.email === "string" ? legacy.email.trim().toLowerCase() : "";
  if (!email) {
    problems.push({ id: String(legacy._id), reason: "missing email" });
    continue;
  }

  const authUser = await db
    .collection("user")
    .findOne({ email }, { projection: { _id: 1, id: 1 } });

  if (!authUser) {
    problems.push({ email, reason: "not present in Better Auth" });
    continue;
  }

  const userIds = [authUser._id, authUser.id].filter(Boolean);
  const credential = await db.collection("account").findOne({
    userId: { $in: userIds },
    providerId: "credential",
    password: { $exists: true, $ne: "" },
  });

  if (!credential) {
    problems.push({ email, reason: "no hashed credential account" });
    continue;
  }

  clearable.push(legacy._id);
}

if (problems.length > 0) {
  console.error("Aborting: some legacy accounts are not safely migrated.");
  for (const problem of problems) {
    console.error(
      `  - ${problem.email ?? problem.id}: ${problem.reason}`
    );
  }
  await client.close();
  process.exit(1);
}

if (dryRun) {
  console.log(
    `Dry run: would remove plaintext passwords from ${clearable.length} legacy user(s).`
  );
  await client.close();
  process.exit(0);
}

if (clearable.length === 0) {
  console.log("No plaintext passwords left in the legacy users collection.");
  await client.close();
  process.exit(0);
}

const result = await db.collection("users").updateMany(
  { _id: { $in: clearable } },
  {
    $unset: { password: "" },
    $set: {
      migratedToBetterAuth: true,
      passwordRemovedAt: new Date(),
    },
  }
);

console.log(
  `Removed plaintext passwords from ${result.modifiedCount} legacy user(s).`
);
console.log("Their credentials are now managed only by Better Auth (hashed).");

await client.close();
