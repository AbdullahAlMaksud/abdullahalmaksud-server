import { Hono } from "hono";

import type { AppEnv } from "../../lib/types.js";
import { adminOnly } from "../../middlewares/role.middleware.js";
import {
  getAllSiteLocales,
  getSiteData,
  resetSiteData,
  updateSiteData,
} from "./site.controller.js";

export const siteRoutes = new Hono<AppEnv>();

// Public routes
siteRoutes.get("/site", getSiteData);

// Admin routes
siteRoutes.get("/site/all", adminOnly, getAllSiteLocales);
siteRoutes.put("/site", adminOnly, updateSiteData);
siteRoutes.put("/site/:locale", adminOnly, updateSiteData);
siteRoutes.post("/site/reset", adminOnly, resetSiteData);
