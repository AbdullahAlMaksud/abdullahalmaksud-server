import { Hono } from "hono";
import { cors } from "hono/cors";

import { healthController } from "./controllers/health.controller";
import { allowedCorsOrigins, corsOrigins, env } from "./lib/env";
import type { AppEnv } from "./lib/types";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { sessionMiddleware } from "./middlewares/session.middleware";
import { routes } from "./routes";

export const app = new Hono<AppEnv>();

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) {
        return null;
      }

      if (corsOrigins.includes("*")) {
        return origin;
      }

      return allowedCorsOrigins.has(origin) ? origin : null;
    },
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use("*", sessionMiddleware);

app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Abdullah Al Maksud API is running",
    authBasePath: "/api/auth",
    healthPath: "/health",
    frontendOrigin: env.CORS_ORIGIN,
  });
});

app.get("/health", healthController);
app.route("/api", routes);

app.notFound(notFoundHandler);
app.onError(errorHandler);

export type AppType = typeof app;
