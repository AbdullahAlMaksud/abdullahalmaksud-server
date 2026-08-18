import { Hono } from "hono";

import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookBySlug,
  updateBook,
} from "./book.controller.js";
import type { AppEnv } from "../../lib/types.js";
import { requireAdmin } from "../../middlewares/role.middleware.js";

export const bookRoutes = new Hono<AppEnv>();

// Public
bookRoutes.get("/books", getAllBooks);
bookRoutes.get("/books/:slug", getBookBySlug);

// Admin only
bookRoutes.post("/books", requireAdmin, createBook);
bookRoutes.put("/books/:id", requireAdmin, updateBook);
bookRoutes.delete("/books/:id", requireAdmin, deleteBook);
