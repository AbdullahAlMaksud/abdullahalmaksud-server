import { Hono } from "hono";

import { uploadFile } from "./upload.controller.js";
import type { AppEnv } from "../../lib/types.js";
import { requireAdmin } from "../../middlewares/role.middleware.js";

export const uploadRoutes = new Hono<AppEnv>();

uploadRoutes.post("/upload", requireAdmin, uploadFile);
