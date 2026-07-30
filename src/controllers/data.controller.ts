import type { Context } from "hono";

import {
  getContentData,
  getDashboardData,
  getSiteData,
  toLocale,
} from "../lib/data";
import type { AppEnv } from "../lib/types";
import { ProjectModel } from "../models/project.model";
import { put } from "@vercel/blob";
import { env } from "../lib/env";

const localeFrom = (c: Context<AppEnv>) => toLocale(c.req.query("locale"));

export const siteController = async (c: Context<AppEnv>) => {
  return c.json(await getSiteData(localeFrom(c)));
};

export const contentController = async (c: Context<AppEnv>) => {
  return c.json(await getContentData(localeFrom(c)));
};

export const projectsController = async (c: Context<AppEnv>) => {
  try {
    const projects = await ProjectModel.find().sort({ createdAt: -1 });
    return c.json(projects);
  } catch (error) {
    return c.json({ success: false, message: "Database query failed" }, 500);
  }
};

export const projectController = async (c: Context<AppEnv>) => {
  try {
    const slug = c.req.param("slug");
    const project = await ProjectModel.findOne({ slug });

    if (!project) {
      return c.json({ success: false, message: "Project not found" }, 404);
    }

    return c.json(project);
  } catch (error) {
    return c.json({ success: false, message: "Database query failed" }, 500);
  }
};

export const createProjectController = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.json();
    
    // Check if slug is unique
    const existing = await ProjectModel.findOne({ slug: body.slug });
    if (existing) {
      return c.json({ success: false, message: "Project with this slug already exists" }, 400);
    }

    const project = new ProjectModel(body);
    await project.save();
    return c.json({ success: true, data: project });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const updateProjectController = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const project = await ProjectModel.findById(id);
    if (!project) {
      return c.json({ success: false, message: "Project not found" }, 404);
    }

    if (body.slug && body.slug !== project.slug) {
      const existing = await ProjectModel.findOne({ slug: body.slug });
      if (existing) {
        return c.json({ success: false, message: "Project with this slug already exists" }, 400);
      }
    }

    Object.assign(project, body);
    await project.save();
    
    return c.json({ success: true, data: project });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const deleteProjectController = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const project = await ProjectModel.findByIdAndDelete(id);
    if (!project) {
      return c.json({ success: false, message: "Project not found" }, 404);
    }
    return c.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const uploadController = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.parseBody();
    const file = body.file;

    if (!file || !(file instanceof File)) {
      return c.json({ success: false, message: "No file uploaded or invalid file" }, 400);
    }

    if (!env.BLOB_READ_WRITE_TOKEN || env.BLOB_READ_WRITE_TOKEN.includes("YOUR_SECRET_TOKEN")) {
      return c.json({ success: false, message: "Vercel Blob token is not configured on the server" }, 400);
    }

    const blob = await put(file.name, file, {
      access: "public",
      token: env.BLOB_READ_WRITE_TOKEN,
    });

    return c.json({ success: true, url: blob.url });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};


export const blogPostsController = async (c: Context<AppEnv>) => {
  const content = await getContentData(localeFrom(c));
  return c.json(content.blogPosts);
};

export const blogPostController = async (c: Context<AppEnv>) => {
  const content = await getContentData(localeFrom(c));
  const post = content.blogPosts.find((item) => item.slug === c.req.param("slug"));

  if (!post) {
    return c.json({ success: false, message: "Blog post not found" }, 404);
  }

  return c.json(post);
};

export const booksController = async (c: Context<AppEnv>) => {
  const content = await getContentData(localeFrom(c));
  return c.json(content.books);
};

export const bookController = async (c: Context<AppEnv>) => {
  const content = await getContentData(localeFrom(c));
  const book = content.books.find((item) => item.id === c.req.param("id"));

  if (!book) {
    return c.json({ success: false, message: "Book not found" }, 404);
  }

  return c.json(book);
};

export const dashboardController = async (c: Context<AppEnv>) => {
  return c.json(await getDashboardData(localeFrom(c)));
};

export const messagesController = async (c: Context<AppEnv>) => {
  const dashboard = (await getDashboardData(localeFrom(c))) as {
    messages: unknown[];
  };
  return c.json(dashboard.messages);
};

export const notificationsController = async (c: Context<AppEnv>) => {
  const dashboard = (await getDashboardData(localeFrom(c))) as {
    notifications: unknown[];
  };
  return c.json(dashboard.notifications);
};
