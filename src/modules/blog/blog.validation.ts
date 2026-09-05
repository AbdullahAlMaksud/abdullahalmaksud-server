import { z } from "zod";

export const authorSchema = z.object({
  name: z.string().default("Abdullah Al Maksud"),
  avatar: z.string().default("/images/avatar.jpg"),
  bio: z.string().default("Developer, designer, writer."),
}).optional();

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(250),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  excerpt: z.string().default(""),
  content: z.any().optional(), // Lexical editor state JSON, block array, or markdown
  contentType: z.enum(["lexical", "markdown", "html", "blocks", "json"]).default("blocks"),
  cover: z.string().default(""),
  coverImage: z.string().default(""),
  author: authorSchema,
  tags: z.array(z.string()).default([]),
  category: z.string().default("Engineering"),
  readingTime: z.string().default("5 min read"),
  featured: z.boolean().default(false),
  featuredType: z.enum(["large", "small", "standard", ""]).default(""),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().default(""),
  metaTitle: z.string().default(""),
  metaDescription: z.string().default(""),
});

export const updateBlogSchema = createBlogSchema.partial();
