import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, bearer, emailOTP } from "better-auth/plugins";

import { authDb, authMongoClient } from "./database.js";
import { sendOtpEmail } from "./email.js";
import { corsOrigins, env } from "./env.js";
import { adminRole, defaultRole, resolveRoleForEmail } from "./roles.js";

const trustedOrigins = corsOrigins.includes("*")
  ? [env.BETTER_AUTH_URL]
  : Array.from(new Set([env.BETTER_AUTH_URL, ...corsOrigins]));

// Only Google OAuth is enabled per specification
const socialProviders: Record<string, any> = {};

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    ...(env.GOOGLE_REDIRECT_URI ? { redirectURI: env.GOOGLE_REDIRECT_URI } : {}),
  };
}

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: mongodbAdapter(authDb, {
    client: authMongoClient,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: false, // Enforce passwordless sign-in via Email OTP
  },
  socialProviders,
  advanced: {
    useSecureCookies: env.NODE_ENV === "production",
    cookiePrefix: "auth",
    crossSubDomainCookies: env.COOKIE_DOMAIN
      ? {
          enabled: true,
          domain: env.COOKIE_DOMAIN,
        }
      : undefined,
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
    emailOTP({
      sendVerificationOTP: async (data) => {
        await sendOtpEmail(data);
      },
      otpLength: 6,
      expiresIn: 300, // 5 minutes
    }),
    bearer(),
    admin({
      defaultRole,
      adminRoles: [adminRole],
    }),
  ],
});
