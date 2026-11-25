import { z } from "zod";

export class AssetPathValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssetPathValidationError";
  }
}

/**
 * Validates and normalizes an asset path so full URLs or inline URIs are never stored in MongoDB.
 * Allows empty strings, local public paths starting with "/", and relative repository paths (e.g. "images/...").
 */
export const normalizeAssetPath = (value: unknown, fieldLabel = "image path"): string => {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value !== "string") {
    throw new AssetPathValidationError(`${fieldLabel} must be a string`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (/^(?:https?:|\/\/|data:|blob:)/i.test(trimmed)) {
    throw new AssetPathValidationError(
      `${fieldLabel} must be a relative asset path; full URLs are not allowed`,
    );
  }

  return trimmed.replace(/^(?:\.\/)+/, "");
};

export const relativeAssetPathSchema = (fieldLabel = "image path") =>
  z.string().transform((val, ctx) => {
    try {
      return normalizeAssetPath(val, fieldLabel);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: (error as Error).message,
      });
      return z.NEVER;
    }
  });

export const sanitizeAssetFieldsInPlace = (
  record: Record<string, unknown>,
  fields: string[],
): void => {
  for (const field of fields) {
    const val = record[field];
    if (val === undefined || val === null) continue;

    if (Array.isArray(val)) {
      record[field] = val.map((item) => normalizeAssetPath(item, field));
    } else {
      record[field] = normalizeAssetPath(val, field);
    }
  }
};

export const sanitizeContentBlocksInPlace = (content: unknown): void => {
  if (!Array.isArray(content)) return;

  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const record = block as { type?: string; data?: Record<string, unknown> };
    if (record.type === "image" && record.data && record.data.url !== undefined) {
      record.data.url = normalizeAssetPath(record.data.url, "content image");
    }
  }
};
