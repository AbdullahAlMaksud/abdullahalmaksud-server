import type { ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

export const notFoundHandler: NotFoundHandler = (c) => {
  return c.json(
    {
      success: false,
      message: `Route ${c.req.method} ${c.req.path} not found`,
    },
    404,
  );
};

export const errorHandler: ErrorHandler = (error, c) => {
  console.error(error);

  if (error instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: error.message,
      },
      error.status,
    );
  }

  if (error instanceof z.ZodError) {
    return c.json(
      {
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      },
      400,
    );
  }

  return c.json(
    {
      success: false,
      message: "Internal server error",
    },
    500,
  );
};
