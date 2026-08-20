import { Hono } from "hono";

import { adminOnly } from "../../middlewares/role.middleware.js";
import type { AppEnv } from "../../lib/types.js";
import {
  createDesign,
  deleteDesign,
  getAllDesigns,
  getDesignById,
  updateDesign,
} from "./design.controller.js";

export const designRoutes = new Hono<AppEnv>();

// Public endpoints
designRoutes.get("/designs", getAllDesigns);
designRoutes.get("/designs/:id", getDesignById);

// Admin endpoints
designRoutes.post("/designs", adminOnly, createDesign);
designRoutes.put("/designs/:id", adminOnly, updateDesign);
designRoutes.delete("/designs/:id", adminOnly, deleteDesign);
