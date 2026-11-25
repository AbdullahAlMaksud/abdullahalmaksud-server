import type { Context } from "hono";

import type { AppEnv } from "../../lib/types.js";
import { AssetPathValidationError, sanitizeAssetFieldsInPlace } from "../../lib/asset-path.js";
import { DesignModel } from "./design.model.js";

export const getAllDesigns = async (c: Context<AppEnv>) => {
  try {
    const category = c.req.query("category");
    const featured = c.req.query("featured");

    const filter: Record<string, any> = {};
    if (category && category.toLowerCase() !== "all") {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    if (featured === "true") {
      filter.featured = true;
    }

    const designs = await DesignModel.find(filter).sort({ createdAt: -1 });
    return c.json(designs);
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const getDesignById = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const design = await DesignModel.findOne({ $or: [{ id }, { _id: id }] });

    if (!design) {
      return c.json({ success: false, message: "Design not found" }, 404);
    }

    return c.json(design);
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const createDesign = async (c: Context<AppEnv>) => {
  try {
    const body = (await c.req.json()) as Record<string, unknown>;
    sanitizeAssetFieldsInPlace(body, ["coverImage"]);

    const existing = await DesignModel.findOne({ id: body.id });
    if (existing) {
      return c.json({ success: false, message: "Design with this ID already exists" }, 400);
    }

    const design = new DesignModel(body);
    await design.save();
    return c.json({ success: true, data: design }, 201);
  } catch (error) {
    const status = error instanceof AssetPathValidationError ? 400 : 500;
    return c.json({ success: false, message: (error as Error).message }, status);
  }
};

export const updateDesign = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const body = (await c.req.json()) as Record<string, unknown>;
    sanitizeAssetFieldsInPlace(body, ["coverImage"]);

    const design = await DesignModel.findOneAndUpdate({ $or: [{ id }, { _id: id }] }, body, {
      returnDocument: "after",
    });

    if (!design) {
      return c.json({ success: false, message: "Design not found" }, 404);
    }

    return c.json({ success: true, data: design });
  } catch (error) {
    const status = error instanceof AssetPathValidationError ? 400 : 500;
    return c.json({ success: false, message: (error as Error).message }, status);
  }
};

export const deleteDesign = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const design = await DesignModel.findOneAndDelete({
      $or: [{ id }, { _id: id }],
    });

    if (!design) {
      return c.json({ success: false, message: "Design not found" }, 404);
    }

    return c.json({ success: true, message: "Design deleted successfully" });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};
