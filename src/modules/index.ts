import { Hono } from "hono";

import { currentSessionController } from "./auth/auth.controller.js";
import type { AppEnv } from "../lib/types.js";
import { authRoutes } from "./auth/auth.routes.js";
import { aboutRoutes } from "./about/about.routes.js";
import { blogRoutes } from "./blog/blog.routes.js";
import { bookRoutes } from "./book/book.routes.js";
import { caseStudyRoutes } from "./case-study/case-study.routes.js";
import { dashboardRoutes } from "./dashboard/dashboard.routes.js";
import { dataRoutes } from "./data/data.routes.js";
import { designRoutes } from "./design/design.routes.js";
import { healthRoutes } from "./health/health.routes.js";
import { homeRoutes } from "./home/home.routes.js";
import { projectRoutes } from "./project/project.routes.js";
import { uploadRoutes } from "./upload/upload.routes.js";
import { contactRoutes } from "./contact/contact.routes.js";
import { handleContactInquiry } from "./contact/contact.controller.js";

export const routes = new Hono<AppEnv>();

// Core
routes.route("/auth", authRoutes);
routes.route("/health", healthRoutes);
routes.get("/me", currentSessionController);
routes.post("/send-email", handleContactInquiry);

// v1 API modules
routes.route("/v1", dataRoutes);
routes.route("/v1", homeRoutes);
routes.route("/v1", aboutRoutes);
routes.route("/v1", projectRoutes);
routes.route("/v1", blogRoutes);
routes.route("/v1", caseStudyRoutes);
routes.route("/v1", bookRoutes);
routes.route("/v1", designRoutes);
routes.route("/v1", uploadRoutes);
routes.route("/v1", dashboardRoutes);
routes.route("/v1", contactRoutes);

// Unversioned aliases for backward compatibility (/api/blogs, /api/projects, etc.)
routes.route("/", projectRoutes);
routes.route("/", blogRoutes);
routes.route("/", caseStudyRoutes);
routes.route("/", bookRoutes);


