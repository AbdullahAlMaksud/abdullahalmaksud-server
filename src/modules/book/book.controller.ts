import type { Context } from "hono";

import type { AppEnv } from "../../lib/types.js";
import { BookModel } from "./book.model.js";

export const getAllBooks = async (c: Context<AppEnv>) => {
  try {
    const page = Math.max(1, Number(c.req.query("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(c.req.query("limit")) || 10));
    const skip = (page - 1) * limit;

    const recommended = c.req.query("recommended");
    const filter: Record<string, any> = {};
    if (recommended === "true") {
      filter.isRecommended = true;
    }

    const [books, total] = await Promise.all([
      BookModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      BookModel.countDocuments(filter),
    ]);

    return c.json({
      success: true,
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const getBookBySlug = async (c: Context<AppEnv>) => {
  try {
    const slug = c.req.param("slug");
    const book = await BookModel.findOne({ slug });

    if (!book) {
      return c.json({ success: false, message: "Book not found" }, 404);
    }

    return c.json({ success: true, data: book });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const createBook = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.json();

    const existing = await BookModel.findOne({ slug: body.slug });
    if (existing) {
      return c.json(
        { success: false, message: "Book with this slug already exists" },
        400
      );
    }

    const book = new BookModel(body);
    await book.save();
    return c.json({ success: true, data: book }, 201);
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const updateBook = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    const book = await BookModel.findById(id);
    if (!book) {
      return c.json({ success: false, message: "Book not found" }, 404);
    }

    if (body.slug && body.slug !== book.slug) {
      const existing = await BookModel.findOne({ slug: body.slug });
      if (existing) {
        return c.json(
          { success: false, message: "Book with this slug already exists" },
          400
        );
      }
    }

    Object.assign(book, body);
    await book.save();

    return c.json({ success: true, data: book });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const deleteBook = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const book = await BookModel.findByIdAndDelete(id);
    if (!book) {
      return c.json({ success: false, message: "Book not found" }, 404);
    }
    return c.json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};
