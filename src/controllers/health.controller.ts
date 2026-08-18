import type { Context } from "hono";

import { getHealth } from "../services/health.service.js";

export const healthController = (c: Context) => {
  return c.json({
    success: true,
    data: getHealth(),
  });
};
