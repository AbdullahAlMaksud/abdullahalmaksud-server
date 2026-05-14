import { Hono } from "hono";

import { healthController } from "../controllers/health.controller";
import type { AppEnv } from "../lib/types";

export const healthRoutes = new Hono<AppEnv>();

healthRoutes.get("/", healthController);
