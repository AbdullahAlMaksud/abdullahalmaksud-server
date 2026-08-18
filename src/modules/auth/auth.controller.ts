import type { Context } from "hono";

import type { AppEnv } from "../../lib/types.js";

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
