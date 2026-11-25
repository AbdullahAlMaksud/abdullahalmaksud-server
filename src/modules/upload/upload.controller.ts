import type { Context } from "hono";

import type { AppEnv } from "../../lib/types.js";
import { env } from "../../lib/env.js";
import {
  commitFileToGitHub,
  deleteFileFromGitHub,
  isGitHubConfigured,
  listRepositoryImages,
} from "../../lib/github.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const MODULE_ALIASES: Record<string, string> = {
  book: "book",
  books: "book",
  blog: "blog",
  blogs: "blog",
  project: "project",
  projects: "project",
  casestudy: "casestudy",
  "case-study": "casestudy",
  "case-studies": "casestudy",
  case_study: "casestudy",
  design: "design",
  designs: "design",
  site: "site",
  profile: "profile",
  general: "general",
};

const sanitizeKey = (key?: unknown, fallback = "misc"): string => {
  if (typeof key !== "string" || !key.trim()) return fallback;
  const cleaned = key
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || fallback;
};

const normalizeModule = (moduleInput?: unknown): string => {
  const sanitized = sanitizeKey(moduleInput, "general");
  return MODULE_ALIASES[sanitized] || sanitized;
};

export const uploadFile = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.parseBody();
    const rawFile = body.file || body.image || body.media;

    if (!rawFile || !(rawFile instanceof File)) {
      return c.json({ success: false, message: "No file uploaded or invalid file format" }, 400);
    }

    const file = rawFile as File;

    if (file.size > MAX_FILE_SIZE) {
      return c.json({ success: false, message: "File size exceeds the 10MB limit" }, 400);
    }

    if (!isGitHubConfigured()) {
      return c.json(
        {
          success: false,
          message: "GitHub asset storage is not configured (GITHUB_TOKEN missing)",
        },
        500,
      );
    }

    const moduleName = normalizeModule(body.module);
    const folderKey = sanitizeKey(body.folderKey, "misc");

    // Sanitize filename to avoid unsafe characters and add short suffix to avoid edge caching collisions
    const lastDotIndex = file.name.lastIndexOf(".");
    const baseName = (lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_{2,}/g, "_");
    const extension = lastDotIndex !== -1 ? file.name.substring(lastDotIndex).toLowerCase() : "";
    const suffix = Date.now().toString(36);
    const sanitizedFilename = `${baseName || "upload"}-${suffix}${extension}`;

    const targetPath = `images/${moduleName}/${folderKey}/${sanitizedFilename}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await commitFileToGitHub({
      path: targetPath,
      content: buffer,
      isBinary: true,
      message: `upload: ${targetPath}`,
    });

    const baseUrl = env.ASSET_CDN_BASE_URL.replace(/\/+$/, "");
    const cdnUrl = `${baseUrl}/${targetPath}`;

    return c.json({
      success: true,
      path: targetPath,
      pathname: targetPath,
      url: cdnUrl,
      downloadUrl: cdnUrl,
      contentType: file.type || undefined,
      module: moduleName,
      folderKey,
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const listFiles = async (c: Context<AppEnv>) => {
  try {
    const prefix = c.req.query("prefix") || undefined;
    const result = await listRepositoryImages(prefix);

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const getFileInfo = async (c: Context<AppEnv>) => {
  try {
    const rawUrl = c.req.query("url") || c.req.query("path");
    if (!rawUrl) {
      return c.json({ success: false, message: "URL or path query parameter is required" }, 400);
    }

    const baseUrl = env.ASSET_CDN_BASE_URL.replace(/\/+$/, "");
    const pathname = rawUrl.replace(baseUrl, "").replace(/^\/+/, "");
    const fullUrl = `${baseUrl}/${pathname}`;

    return c.json({
      success: true,
      data: {
        url: fullUrl,
        downloadUrl: fullUrl,
        pathname,
      },
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const deleteFile = async (c: Context<AppEnv>) => {
  try {
    let rawTarget = c.req.query("url") || c.req.query("path");
    if (!rawTarget) {
      try {
        const body = (await c.req.json()) as { url?: string; path?: string };
        rawTarget = body?.url || body?.path;
      } catch {
        // Body was not JSON
      }
    }

    if (!rawTarget) {
      return c.json({ success: false, message: "URL or path is required to delete file" }, 400);
    }

    const baseUrl = env.ASSET_CDN_BASE_URL.replace(/\/+$/, "");
    const pathname = rawTarget.replace(baseUrl, "").replace(/^\/+/, "");

    await deleteFileFromGitHub({
      path: pathname,
      message: `delete: ${pathname}`,
    });

    return c.json({ success: true, message: "File deleted successfully from repository" });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};
