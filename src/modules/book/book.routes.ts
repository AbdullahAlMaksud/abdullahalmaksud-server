import { Hono } from "hono";

import { adminOnly } from "../../middlewares/role.middleware.js";
import type { AppEnv } from "../../lib/types.js";
import {
  createBook,
  deleteBook,
  getBookBundle,
  getAllStandaloneBooks,
  updateBook,
  updateBookBundle,
} from "./book.controller.js";

export const bookRoutes = new Hono<AppEnv>();

// Public routes
bookRoutes.get("/books", getBookBundle);
bookRoutes.get("/books/all", getAllStandaloneBooks);

// Admin-only mutations
bookRoutes.put("/books/bundle", adminOnly, updateBookBundle);
bookRoutes.post("/books", adminOnly, createBook);
bookRoutes.put("/books/:id", adminOnly, updateBook);
bookRoutes.delete("/books/:id", adminOnly, deleteBook);
