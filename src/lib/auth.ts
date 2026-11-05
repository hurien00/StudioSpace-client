import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("stdio_space");

export const auth = betterAuth({
  // The auth handler lives inside this Next.js app, so the fallback must
  // point at the app itself (not the separate Express API on port 8000).
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    // Keep in sync with the registration form's validation (6 characters).
    minPasswordLength: 6,
  },
  // The JWT is cached in an HTTPOnly cookie for the same lifetime as the
  // session, so keep its `exp` claim in sync (defaults to 15 minutes).
  plugins: [jwt({ jwt: { expirationTime: "7d" } })],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});
