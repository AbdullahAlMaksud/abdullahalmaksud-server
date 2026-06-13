import { Hono } from "hono";

import {
  blogPostController,
  blogPostsController,
  bookController,
  booksController,
  contentController,
  dashboardController,
  messagesController,
  notificationsController,
  projectController,
  projectsController,
  siteController,
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

dataRoutes.get("/dashboard", requireAdmin, dashboardController);
dataRoutes.get("/messages", requireAdmin, messagesController);
dataRoutes.get("/notifications", requireAdmin, notificationsController);
