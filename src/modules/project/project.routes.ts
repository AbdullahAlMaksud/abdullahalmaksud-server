import { Hono } from "hono";

import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectBySlug,
  updateProject,
} from "./project.controller.js";
import type { AppEnv } from "../../lib/types.js";
import { requireAdmin } from "../../middlewares/role.middleware.js";

export const projectRoutes = new Hono<AppEnv>();

// Public
projectRoutes.get("/projects", getAllProjects);
projectRoutes.get("/projects/:slug", getProjectBySlug);

// Admin only
projectRoutes.post("/projects", requireAdmin, createProject);
projectRoutes.put("/projects/:id", requireAdmin, updateProject);
projectRoutes.delete("/projects/:id", requireAdmin, deleteProject);
