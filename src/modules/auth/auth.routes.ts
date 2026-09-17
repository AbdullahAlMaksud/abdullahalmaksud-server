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
    // Timeout guard: prevent auth handler from hanging beyond 25s on Vercel
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Auth handler timed out (25s)")), 25000)
    );

    return await Promise.race([
      auth.handler(c.req.raw),
      timeoutPromise,
    ]);
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
