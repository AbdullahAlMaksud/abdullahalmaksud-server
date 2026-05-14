import { Hono } from "hono";

import { currentSessionController } from "../controllers/auth.controller";
import type { AppEnv } from "../lib/types";
import { authRoutes } from "./auth.routes";
import { healthRoutes } from "./health.routes";

export const routes = new Hono<AppEnv>();

routes.route("/auth", authRoutes);
routes.route("/health", healthRoutes);
routes.get("/me", currentSessionController);
