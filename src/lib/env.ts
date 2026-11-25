import dotenv from "dotenv";
import { z } from "zod";

// Load base .env
dotenv.config();
// If specific NODE_ENV is set and corresponding file exists, override
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production", override: true });
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().min(1).default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().min(1).default("abdullahalmaksud"),
  REQUIRE_DATABASE_CONNECTION: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:5000"),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:3000"),
  ADMIN_EMAILS: z.string().default(""),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
  COOKIE_DOMAIN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("Abdullah Al Maksud Admin <onboarding@resend.dev>"),
  CONTACT_RECIPIENT_EMAIL: z.string().default("contact@abdullahalmaksud.com"),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  GITHUB_REPO_OWNER: z.string().default("abdullahalmaksud"),
  GITHUB_REPO_NAME: z.string().default("abdullahalmaksud-assets"),
  GITHUB_BRANCH: z.string().default("main"),
  ASSET_CDN_BASE_URL: z.string().default("https://assets.abdullahalmaksud.com"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;

export const requireDatabaseConnection =
  env.REQUIRE_DATABASE_CONNECTION ?? env.NODE_ENV === "production";

const normalizeOrigin = (origin: string) => {
  if (origin === "*") {
    return origin;
  }

  try {
    const url = new URL(origin);
    return url.origin;
  } catch {
    return origin.replace(/\/+$/, "");
  }
};

const withCommonOriginVariants = (origin: string) => {
  const normalizedOrigin = normalizeOrigin(origin);

  if (normalizedOrigin === "*") {
    return [normalizedOrigin];
  }

  try {
    const url = new URL(normalizedOrigin);
    const variants = [url.origin];

    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      variants.push(url.origin);
    } else {
      url.hostname = `www.${url.hostname}`;
      variants.push(url.origin);
    }

    return variants;
  } catch {
    return [normalizedOrigin];
  }
};

export const corsOrigins = env.CORS_ORIGIN.split(",")
  .flatMap((origin) => withCommonOriginVariants(origin.trim()))
  .filter(Boolean);

export const allowedCorsOrigins = new Set(corsOrigins);

export const isAllowedOrigin = (origin?: string | null): boolean => {
  if (!origin) return false;
  if (corsOrigins.includes("*")) return true;
  if (allowedCorsOrigins.has(origin)) return true;

  try {
    const url = new URL(origin);
    const host = url.hostname;

    // Allow apex domain and all subdomains of abdullahalmaksud.com
    if (host === "abdullahalmaksud.com" || host.endsWith(".abdullahalmaksud.com")) {
      return true;
    }

    // Allow local development (any port on localhost or 127.0.0.1)
    if (host === "localhost" || host === "127.0.0.1") {
      return true;
    }

    // Allow Vercel preview & production deployments for abdullahalmaksud
    if (host.endsWith(".vercel.app") && host.includes("abdullahalmaksud")) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
};

export const adminEmails = new Set(
  env.ADMIN_EMAILS.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);
