import { Hono } from "hono";

import { adminOnly } from "../../middlewares/role.middleware.js";
import type { AppEnv } from "../../lib/types.js";
import { getAboutData, updateAboutData } from "./about.controller.js";

export const aboutRoutes = new Hono<AppEnv>();

aboutRoutes.get("/about", getAboutData);
aboutRoutes.put("/about", adminOnly, updateAboutData);
