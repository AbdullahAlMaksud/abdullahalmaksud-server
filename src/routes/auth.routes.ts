import { Hono } from "hono";

import { auth } from "../lib/auth.js";
import { getDatabaseConnectionHelp, isAuthDatabaseConnected } from "../lib/database.js";
import type { AppEnv } from "../lib/types.js";

export const authRoutes = new Hono<AppEnv>();

authRoutes.on(["GET", "POST"], "/*", (c) => {
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

  return auth.handler(c.req.raw as unknown as Request);
});
