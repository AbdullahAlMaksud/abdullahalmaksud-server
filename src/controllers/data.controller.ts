import type { Context } from "hono";

import {
  getContentData,
  getDashboardData,
  getSiteData,
  toLocale,
} from "../lib/data";
import type { AppEnv } from "../lib/types";

const localeFrom = (c: Context<AppEnv>) => toLocale(c.req.query("locale"));

export const siteController = async (c: Context<AppEnv>) => {
  return c.json(await getSiteData(localeFrom(c)));
};

export const contentController = async (c: Context<AppEnv>) => {
  return c.json(await getContentData(localeFrom(c)));
};

export const projectsController = async (c: Context<AppEnv>) => {
  const content = await getContentData(localeFrom(c));
  return c.json(content.projects);
};

export const projectController = async (c: Context<AppEnv>) => {
  const content = await getContentData(localeFrom(c));
  const project = content.projects.find((item) => item.slug === c.req.param("slug"));

  if (!project) {
    return c.json({ success: false, message: "Project not found" }, 404);
  }

  return c.json(project);
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
