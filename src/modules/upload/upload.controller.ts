import type { Context } from "hono";
import { del, head, list, put } from "@vercel/blob";

import type { AppEnv } from "../../lib/types.js";
import { env } from "../../lib/env.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

    if (!env.BLOB_READ_WRITE_TOKEN || env.BLOB_READ_WRITE_TOKEN.includes("YOUR_SECRET_TOKEN")) {
      return c.json({ success: false, message: "Vercel Blob token is not configured on the server" }, 500);
    }

    // Sanitize filename to avoid unsafe characters
    const lastDotIndex = file.name.lastIndexOf(".");
    const baseName = (lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_{2,}/g, "_");
    const extension = lastDotIndex !== -1 ? file.name.substring(lastDotIndex) : "";
    const sanitizedPathname = `${baseName || "upload"}${extension}`;

    const blob = await put(sanitizedPathname, file, {
      access: "public",
      token: env.BLOB_READ_WRITE_TOKEN,
      contentType: file.type || undefined,
      addRandomSuffix: true,
    });

    return c.json({
      success: true,
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      contentType: blob.contentType,
      data: blob,
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const listFiles = async (c: Context<AppEnv>) => {
  try {
    if (!env.BLOB_READ_WRITE_TOKEN || env.BLOB_READ_WRITE_TOKEN.includes("YOUR_SECRET_TOKEN")) {
      return c.json({ success: false, message: "Vercel Blob token is not configured on the server" }, 500);
    }

    const limitQuery = c.req.query("limit");
    const limit = limitQuery ? Math.min(Number(limitQuery) || 50, 100) : 50;
    const cursor = c.req.query("cursor") || undefined;
    const prefix = c.req.query("prefix") || undefined;

    const result = await list({
      token: env.BLOB_READ_WRITE_TOKEN,
      limit,
      cursor,
      prefix,
    });

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
    const url = c.req.query("url");
    if (!url) {
      return c.json({ success: false, message: "URL query parameter is required" }, 400);
    }

    if (!env.BLOB_READ_WRITE_TOKEN || env.BLOB_READ_WRITE_TOKEN.includes("YOUR_SECRET_TOKEN")) {
      return c.json({ success: false, message: "Vercel Blob token is not configured on the server" }, 500);
    }

    const info = await head(url, {
      token: env.BLOB_READ_WRITE_TOKEN,
    });

    return c.json({ success: true, data: info });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const deleteFile = async (c: Context<AppEnv>) => {
  try {
    let url = c.req.query("url");
    if (!url) {
      try {
        const body = await c.req.json();
        url = body?.url;
      } catch {
        // Body was not JSON
      }
    }

    if (!url) {
      return c.json({ success: false, message: "URL is required to delete blob" }, 400);
    }

    if (!env.BLOB_READ_WRITE_TOKEN || env.BLOB_READ_WRITE_TOKEN.includes("YOUR_SECRET_TOKEN")) {
      return c.json({ success: false, message: "Vercel Blob token is not configured on the server" }, 500);
    }

    await del(url, {
      token: env.BLOB_READ_WRITE_TOKEN,
    });

    return c.json({ success: true, message: "File deleted successfully from Vercel Blob" });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};
