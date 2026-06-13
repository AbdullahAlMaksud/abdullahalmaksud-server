import { Hono } from "hono";

import { auth } from "../lib/auth";
import { getDatabaseConnectionHelp, isAuthDatabaseConnected } from "../lib/database";
import type { AppEnv } from "../lib/types";

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

  return auth.handler(c.req.raw);
});
