import { createMiddleware } from "hono/factory";

import { auth } from "../lib/auth.js";
import {
  authDb,
  isAuthDatabaseConnected,
  isDatabaseConnectionError,
  markAuthDatabaseDisconnected,
} from "../lib/database.js";
import { defaultRole, resolveRoleForEmail } from "../lib/roles.js";
import type { AppEnv } from "../lib/types.js";

export const sessionMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  if (!isAuthDatabaseConnected()) {
    c.set("user", null);
    c.set("session", null);
    await next();
    return;
  }

  const session = await auth.api
    .getSession({
      headers: (c.req.raw as any).headers as Headers,
    })
    .catch((error) => {
      if (isDatabaseConnectionError(error)) {
        markAuthDatabaseDisconnected();
        return null;
      }

      throw error;
    });

  let user = session?.user ?? null;

  if (user) {
    const resolvedRole = resolveRoleForEmail(user.email);
    const currentRole = typeof user.role === "string" ? user.role : defaultRole;
    const role = resolvedRole === "admin" ? resolvedRole : currentRole;

    if (role !== user.role) {
      await authDb
        .collection("user")
        .updateOne({ id: user.id }, { $set: { role } })
        .catch((error) => {
          if (isDatabaseConnectionError(error)) {
            markAuthDatabaseDisconnected();
            return null;
          }

          throw error;
        });
      user = { ...user, role };
    }
  }

  c.set("user", user);
  c.set("session", session?.session ?? null);

  await next();
});
