import { z } from "zod";

export const caseStudyResultSchema = z.object({
  metric: z.string().min(1, "Metric name is required"),
  value: z.string().min(1, "Metric value is required"),
  description: z.string().default(""),
});

export const createCaseStudySchema = z.object({
  title: z.string().min(1, "Title is required").max(250),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  excerpt: z.string().default(""),
  content: z.any().optional(), // Lexical EditorState JSON, block array, or markdown string
  contentType: z.enum(["lexical", "markdown", "html", "blocks", "json"]).default("blocks"),
  coverImage: z.string().default(""),
  screenshots: z.array(z.string()).default([]),
  projectSlug: z.string().default(""),
  tags: z.array(z.string()).default([]),
  category: z.string().default("Architecture"),
  industry: z.string().default(""),
  client: z.string().default(""),
  challenge: z.string().default(""),
  solution: z.string().default(""),
  results: z.array(caseStudyResultSchema).default([]),
  stack: z.array(z.string()).default([]),
  duration: z.string().default(""),
  readingTime: z.string().default("8 min read"),
  featured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().default(""),
  sortOrder: z.number().default(0),
  metaTitle: z.string().default(""),
  metaDescription: z.string().default(""),
});

export const updateCaseStudySchema = createCaseStudySchema.partial();
