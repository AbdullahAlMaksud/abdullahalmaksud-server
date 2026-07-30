import { Hono } from "hono";

import {
  blogPostController,
  blogPostsController,
  bookController,
  booksController,
  contentController,
  createProjectController,
  dashboardController,
  deleteProjectController,
  messagesController,
  notificationsController,
  projectController,
  projectsController,
  siteController,
  updateProjectController,
  uploadController,
} from "../controllers/data.controller";
import type { AppEnv } from "../lib/types";
import { requireAdmin } from "../middlewares/role.middleware";

export const dataRoutes = new Hono<AppEnv>();

dataRoutes.get("/site", siteController);
dataRoutes.get("/content", contentController);
dataRoutes.get("/projects", projectsController);
dataRoutes.get("/projects/:slug", projectController);
dataRoutes.get("/blog-posts", blogPostsController);
dataRoutes.get("/blog-posts/:slug", blogPostController);
dataRoutes.get("/books", booksController);
dataRoutes.get("/books/:id", bookController);

dataRoutes.post("/projects", requireAdmin, createProjectController);
dataRoutes.put("/projects/:id", requireAdmin, updateProjectController);
dataRoutes.delete("/projects/:id", requireAdmin, deleteProjectController);
dataRoutes.post("/upload", requireAdmin, uploadController);

dataRoutes.get("/dashboard", requireAdmin, dashboardController);
dataRoutes.get("/messages", requireAdmin, messagesController);
dataRoutes.get("/notifications", requireAdmin, notificationsController);
