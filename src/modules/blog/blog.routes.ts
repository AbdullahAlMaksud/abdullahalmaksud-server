import { Hono } from "hono";

import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
} from "./blog.controller.js";
import type { AppEnv } from "../../lib/types.js";
import { requireAdmin } from "../../middlewares/role.middleware.js";

export const blogRoutes = new Hono<AppEnv>();

// Public
blogRoutes.get("/blogs", getAllBlogs);
blogRoutes.get("/blogs/:slug", getBlogBySlug);

// Admin only
blogRoutes.post("/blogs", requireAdmin, createBlog);
blogRoutes.put("/blogs/:id", requireAdmin, updateBlog);
blogRoutes.delete("/blogs/:id", requireAdmin, deleteBlog);
