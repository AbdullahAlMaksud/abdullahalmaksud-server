import { Hono } from "hono";

import {
  createCaseStudy,
  deleteCaseStudy,
  getAllCaseStudies,
  getCaseStudyById,
  getCaseStudyBySlug,
  updateCaseStudy,
} from "./case-study.controller.js";
import type { AppEnv } from "../../lib/types.js";
import { requireAdmin } from "../../middlewares/role.middleware.js";

export const caseStudyRoutes = new Hono<AppEnv>();

// Public routes
caseStudyRoutes.get("/case-studies", getAllCaseStudies);
caseStudyRoutes.get("/case-studies/:slug", getCaseStudyBySlug);

// Admin routes
caseStudyRoutes.get("/case-studies/id/:id", requireAdmin, getCaseStudyById);
caseStudyRoutes.post("/case-studies", requireAdmin, createCaseStudy);
caseStudyRoutes.put("/case-studies/:id", requireAdmin, updateCaseStudy);
caseStudyRoutes.patch("/case-studies/:id", requireAdmin, updateCaseStudy);
caseStudyRoutes.delete("/case-studies/:id", requireAdmin, deleteCaseStudy);
