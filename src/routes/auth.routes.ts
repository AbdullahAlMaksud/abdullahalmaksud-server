import { Hono } from "hono";

import { auth } from "../lib/auth";
import type { AppEnv } from "../lib/types";

export const authRoutes = new Hono<AppEnv>();

authRoutes.on(["GET", "POST"], "/*", (c) => {
  return auth.handler(c.req.raw);
});
