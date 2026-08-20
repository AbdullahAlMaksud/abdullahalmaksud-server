import { Hono } from "hono";

import { adminOnly } from "../../middlewares/role.middleware.js";
import type { AppEnv } from "../../lib/types.js";
import { getHomeData, updateHomeData } from "./home.controller.js";

export const homeRoutes = new Hono<AppEnv>();

homeRoutes.get("/home", getHomeData);
homeRoutes.put("/home", adminOnly, updateHomeData);
