import type { Context } from "hono";

import type { AppEnv } from "../../lib/types.js";
import { BlogModel } from "./blog.model.js";

export const getAllBlogs = async (c: Context<AppEnv>) => {
  try {
    const page = Math.max(1, Number(c.req.query("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(c.req.query("limit")) || 10));
    const skip = (page - 1) * limit;

    const publishedOnly = c.req.query("published");
    const filter: Record<string, any> = {};
    if (publishedOnly === "true") {
      filter.isPublished = true;
    }

    const [blogs, total] = await Promise.all([
      BlogModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      BlogModel.countDocuments(filter),
    ]);

    return c.json({
      success: true,
      data: blogs,
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

export const getBlogBySlug = async (c: Context<AppEnv>) => {
  try {
    const slug = c.req.param("slug");
    const blog = await BlogModel.findOne({ slug });

    if (!blog) {
      return c.json({ success: false, message: "Blog post not found" }, 404);
    }

    return c.json({ success: true, data: blog });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const createBlog = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.json();

    const existing = await BlogModel.findOne({ slug: body.slug });
    if (existing) {
      return c.json(
        { success: false, message: "Blog post with this slug already exists" },
        400
      );
    }

    const blog = new BlogModel(body);
    await blog.save();
    return c.json({ success: true, data: blog }, 201);
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const updateBlog = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    const blog = await BlogModel.findById(id);
    if (!blog) {
      return c.json({ success: false, message: "Blog post not found" }, 404);
    }

    if (body.slug && body.slug !== blog.slug) {
      const existing = await BlogModel.findOne({ slug: body.slug });
      if (existing) {
        return c.json(
          { success: false, message: "Blog post with this slug already exists" },
          400
        );
      }
    }

    Object.assign(blog, body);
    await blog.save();

    return c.json({ success: true, data: blog });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const deleteBlog = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const blog = await BlogModel.findByIdAndDelete(id);
    if (!blog) {
      return c.json({ success: false, message: "Blog post not found" }, 404);
    }
    return c.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};
