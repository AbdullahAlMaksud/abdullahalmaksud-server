import { Hono } from "hono";

import { currentSessionController } from "../controllers/auth.controller.js";
import type { AppEnv } from "../lib/types.js";
import { authRoutes } from "./auth.routes.js";
import { dataRoutes } from "./data.routes.js";
import { healthRoutes } from "./health.routes.js";

export const routes = new Hono<AppEnv>();

routes.route("/auth", authRoutes);
routes.route("/health", healthRoutes);
routes.get("/me", currentSessionController);
routes.route("/v1", dataRoutes);
