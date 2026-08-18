import type { Context } from "hono";

import { put } from "@vercel/blob";
import type { AppEnv } from "../../lib/types.js";
import { env } from "../../lib/env.js";

export const uploadFile = async (c: Context<AppEnv>) => {
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
