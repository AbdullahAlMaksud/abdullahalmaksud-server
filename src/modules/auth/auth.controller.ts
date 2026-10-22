import type { Context } from "hono";

import type { AppEnv } from "../../lib/types.js";
import { getAuthDb } from "../../lib/database.js";

export const currentSessionController = (c: Context<AppEnv>) => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user || !session) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
      },
      401,
    );
  }

  return c.json({
    success: true,
    data: {
      user,
      session,
    },
  });
};

export const updateProfileController = async (c: Context<AppEnv>) => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user || !session) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
      },
      401,
    );
  }

  try {
    const body = await c.req.json();
    const updateFields: Record<string, any> = {};

    if (body.name !== undefined && typeof body.name === "string") {
      updateFields.name = body.name.trim();
    }
    if (body.image !== undefined && typeof body.image === "string") {
      updateFields.image = body.image.trim();
    }
    if (body.avatar !== undefined && typeof body.avatar === "string") {
      updateFields.image = body.avatar.trim();
    }

    if (Object.keys(updateFields).length > 0) {
      updateFields.updatedAt = new Date();
      await getAuthDb()
        .collection("user")
        .updateOne({ $or: [{ id: user.id }, { email: user.email }] }, { $set: updateFields });
    }

    const updatedUser = {
      ...user,
      ...updateFields,
    };

    return c.json({
      success: true,
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};
