import { createMiddleware } from "hono/factory";

import { auth } from "../lib/auth";
import type { AppEnv } from "../lib/types";

export const sessionMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);

  await next();
});
