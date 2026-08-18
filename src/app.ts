import { Hono } from "hono";
import { cors } from "hono/cors";

import { healthController } from "./modules/health/health.controller.js";
import { allowedCorsOrigins, corsOrigins, env } from "./lib/env.js";
import type { AppEnv } from "./lib/types.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { sessionMiddleware } from "./middlewares/session.middleware.js";
import { routes } from "./modules/index.js";

import { renderRootHtml } from "./modules/home/home.view.js";

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

app.get("/favicon.ico", (c) => c.body(null, 204));
app.get("/public/favicon.svg", (c) => c.body(null, 204));

app.get("/", (c) => {
  const format = c.req.query("format");
  const acceptHeader = c.req.header("accept") || "";

  if (format === "json" || (acceptHeader.includes("application/json") && !acceptHeader.includes("text/html"))) {
    return c.json({
      success: true,
      message: "Abdullah Al Maksud API is running",
      authBasePath: "/api/auth",
      healthPath: "/health",
      frontendOrigin: env.CORS_ORIGIN,
    });
  }

  const host = c.req.header("host") || "localhost:4000";
  const protocol = host.includes("localhost") ? "http" : "https";
  return c.html(renderRootHtml(`${protocol}://${host}`));
});

app.get("/health", healthController);
app.route("/api", routes);

app.notFound(notFoundHandler);
app.onError(errorHandler);

export default app;
export type AppType = typeof app;
