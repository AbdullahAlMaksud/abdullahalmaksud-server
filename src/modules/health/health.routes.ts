import { Hono } from "hono";

import { healthController } from "./health.controller.js";
import type { AppEnv } from "../../lib/types.js";

export const healthRoutes = new Hono<AppEnv>();

healthRoutes.get("/", healthController);
