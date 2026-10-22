import type { Context } from "hono";

import type { AppEnv } from "../../lib/types.js";
import { BlogModel } from "./blog.model.js";
import { createBlogSchema, updateBlogSchema } from "./blog.validation.js";

export const getAllBlogs = async (c: Context<AppEnv>) => {
  try {
    const page = Math.max(1, Number(c.req.query("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(c.req.query("limit")) || 20));
    const skip = (page - 1) * limit;

    const publishedOnly = c.req.query("published");
    const category = c.req.query("category");
    const featured = c.req.query("featured");
    const search = c.req.query("search");
    const includeContent = c.req.query("includeContent") === "true";

    const filter: Record<string, any> = {};
    if (publishedOnly === "true") {
      filter.isPublished = true;
    } else if (publishedOnly === "false") {
      filter.isPublished = false;
    }

    if (category && category.toLowerCase() !== "all") {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    if (featured === "true") {
      filter.featured = true;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Exclude content on list views by default for high performance
    const projection = includeContent ? {} : { content: 0 };

    const [blogs, total] = await Promise.all([
      BlogModel.find(filter, projection).sort({ createdAt: -1 }).skip(skip).limit(limit),
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

export const getBlogById = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const blog = await BlogModel.findById(id);

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
    const parsed = createBlogSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.format(),
        },
        400,
      );
    }

    const existing = await BlogModel.findOne({ slug: parsed.data.slug });
    if (existing) {
      return c.json({ success: false, message: "Blog post with this slug already exists" }, 400);
    }

    const blog = new BlogModel(parsed.data);
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
    const parsed = updateBlogSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.format(),
        },
        400,
      );
    }

    const blog = await BlogModel.findById(id);
    if (!blog) {
      return c.json({ success: false, message: "Blog post not found" }, 404);
    }

    if (parsed.data.slug && parsed.data.slug !== blog.slug) {
      const existing = await BlogModel.findOne({ slug: parsed.data.slug });
      if (existing) {
        return c.json({ success: false, message: "Blog post with this slug already exists" }, 400);
      }
    }

    Object.assign(blog, parsed.data);
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
