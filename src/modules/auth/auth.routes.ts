import { Hono } from "hono";

import { auth } from "../../lib/auth.js";
import { getDatabaseConnectionHelp, isAuthDatabaseConnected } from "../../lib/database.js";
import type { AppEnv } from "../../lib/types.js";

export const authRoutes = new Hono<AppEnv>();

authRoutes.on(["GET", "POST"], "/*", async (c) => {
  if (!isAuthDatabaseConnected()) {
    return c.json(
      {
        success: false,
        message: "Authentication is unavailable until MongoDB is connected.",
        hint: getDatabaseConnectionHelp(new Error("MongoDB is not connected")),
      },
      503,
    );
  }

  try {
    // Build a proper Web Request from Hono's context for BetterAuth
    const url = new URL(c.req.url);
    const headers = new Headers();
    c.req.raw.headers.forEach((value, key) => {
      headers.set(key, value);
    });

    const isBodyMethod = ["POST", "PUT", "PATCH"].includes(c.req.method);
    const webRequest = new Request(url.toString(), {
      method: c.req.method,
      headers,
      body: isBodyMethod ? await c.req.text() : undefined,
    });

    // Timeout guard: prevent auth handler from hanging beyond 25s on Vercel
    const timeoutPromise = new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Auth handler timed out (25s)")), 25000)
    );

    const response = await Promise.race([
      auth.handler(webRequest),
      timeoutPromise,
    ]);

    return response;
  } catch (error) {
    console.error("[AUTH] Handler error:", error);
    return c.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Authentication request failed",
      },
      500,
    );
  }
});
