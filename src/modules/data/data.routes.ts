import { Hono } from "hono";

import { contentController, siteController } from "./data.controller.js";
import type { AppEnv } from "../../lib/types.js";

export const dataRoutes = new Hono<AppEnv>();

dataRoutes.get("/site", siteController);
dataRoutes.get("/content", contentController);
