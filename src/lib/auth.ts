import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

import { authDb, authMongoClient } from "./database";
import { corsOrigins, env } from "./env";
import { adminRole, defaultRole, resolveRoleForEmail } from "./roles";

const trustedOrigins = corsOrigins.includes("*")
  ? [env.BETTER_AUTH_URL]
  : Array.from(new Set([env.BETTER_AUTH_URL, ...corsOrigins]));

const googleProvider =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {};

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
  socialProviders: googleProvider,
  advanced: {
    useSecureCookies: env.NODE_ENV === "production",
    cookiePrefix: "auth",
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            role: resolveRoleForEmail(user.email),
          },
        }),
      },
    },
  },
  plugins: [
    admin({
      defaultRole,
      adminRoles: [adminRole],
    }),
  ],
});
