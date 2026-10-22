import { Hono } from "hono";

import { deleteFile, getFileInfo, listFiles, uploadFile } from "./upload.controller.js";
import type { AppEnv } from "../../lib/types.js";
import { requireAdmin } from "../../middlewares/role.middleware.js";

export const uploadRoutes = new Hono<AppEnv>();

// Upload new file (image / media)
uploadRoutes.post("/upload", requireAdmin, uploadFile);

// Get list of uploaded blobs
uploadRoutes.get("/upload", requireAdmin, listFiles);

// Get single blob metadata (head)
uploadRoutes.get("/upload/info", requireAdmin, getFileInfo);

// Delete blob by URL
uploadRoutes.delete("/upload", requireAdmin, deleteFile);
