import type { Context } from "hono";

import type { AppEnv } from "../../lib/types.js";
import { BookBundleModel, BookModel } from "./book.model.js";
import defaultBookData from "../../data/book.json" with { type: "json" };

export const getBookBundle = async (c: Context<AppEnv>) => {
  try {
    let bundle = await BookBundleModel.findOne({ key: "main" });
    if (!bundle) {
      // Fallback or self-initialize from local static data
      return c.json({
        success: true,
        data: defaultBookData,
      });
    }

    return c.json({
      success: true,
      data: {
        book: bundle.book,
        stats: bundle.stats,
        books: bundle.books,
      },
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const updateBookBundle = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.json();
    const bundle = await BookBundleModel.findOneAndUpdate(
      { key: "main" },
      { $set: body },
      { new: true, upsert: true }
    );
    return c.json({ success: true, data: bundle });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const getAllStandaloneBooks = async (c: Context<AppEnv>) => {
  try {
    const books = await BookModel.find().sort({ year: -1 });
    return c.json({ success: true, data: books });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const createBook = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.json();
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

    const book = await BookModel.findByIdAndUpdate(id, body, { new: true });
    if (!book) {
      return c.json({ success: false, message: "Book not found" }, 404);
    }

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
