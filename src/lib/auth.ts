import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { authDb, authMongoClient } from "./database";
import { corsOrigins, env } from "./env";

const trustedOrigins = corsOrigins.includes("*")
  ? [env.BETTER_AUTH_URL]
  : Array.from(new Set([env.BETTER_AUTH_URL, ...corsOrigins]));

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: mongodbAdapter(authDb, {
    client: authMongoClient,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
