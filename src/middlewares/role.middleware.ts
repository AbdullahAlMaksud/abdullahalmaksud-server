import { createMiddleware } from "hono/factory";

import { isAdminRole } from "../lib/roles.js";
import type { AppEnv } from "../lib/types.js";

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  if (!c.get("user") || !c.get("session")) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
      },
      401,
    );
  }

  await next();
});

export const requireAdmin = createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get("user");

  if (!user || !c.get("session")) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
      },
      401,
    );
  }

  if (!isAdminRole(user.role)) {
    return c.json(
      {
        success: false,
        message: "Forbidden",
      },
      403,
    );
  }

  await next();
});

export const adminOnly = requireAdmin;

