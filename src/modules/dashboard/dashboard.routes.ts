import { Hono } from "hono";

import {
  getDashboard,
  getMessages,
  getNotifications,
} from "./dashboard.controller.js";
import type { AppEnv } from "../../lib/types.js";
import { requireAdmin } from "../../middlewares/role.middleware.js";

export const dashboardRoutes = new Hono<AppEnv>();

dashboardRoutes.get("/dashboard", requireAdmin, getDashboard);
dashboardRoutes.get("/messages", requireAdmin, getMessages);
dashboardRoutes.get("/notifications", requireAdmin, getNotifications);
