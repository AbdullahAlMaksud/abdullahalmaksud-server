import { z } from "zod";

export const coreFeatureSchema = z.object({
  icon: z.string().default(""),
  text: z.string().min(1, "Feature text is required"),
  desc: z.string().min(1, "Feature description is required"),
});

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(250),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  description: z.string().default(""),
  longDescription: z.string().default(""),
  content: z.any().optional(),
  contentType: z.enum(["blocks", "lexical", "json", "markdown", "html"]).default("blocks"),
  fullContent: z.any().optional(),
  coverImage: z.string().default(""),
  image: z.string().optional(), // legacy alias
  logo: z.string().default(""),
  imageBg: z.string().default("#0F131A"),
  barColor: z.string().default("#E5A93C"),
  screenshots: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  stack: z.array(z.string()).default([]),
  category: z.string().default(""),
  categories: z.array(z.string()).optional(), // legacy alias
  github: z.string().default(""),
  gitRepo: z.string().optional(), // legacy alias
  repo: z.string().optional(), // legacy alias
  liveLink: z.string().default(""),
  link: z.string().optional(), // legacy alias
  demo: z.string().optional(), // legacy alias
  year: z.string().default(() => new Date().getFullYear().toString()),
  status: z.enum(["live", "case-study", "prototype", "archived", "building"]).default("live"),
  featured: z.boolean().default(false),
  isFeatured: z.boolean().optional(), // legacy alias
  sortOrder: z.number().default(0),
  index: z.union([z.string(), z.number()]).optional(), // legacy alias
  coreFeatures: z.array(coreFeatureSchema).default([]),
  metaTitle: z.string().default(""),
  metaDescription: z.string().default(""),
});

export const updateProjectSchema = createProjectSchema.partial();
