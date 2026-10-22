import type { Context } from "hono";

import type { AppEnv } from "../../lib/types.js";
import { ProjectModel } from "../project/project.model.js";
import { BlogModel } from "../blog/blog.model.js";
import { BookModel } from "../book/book.model.js";
import { CaseStudyModel } from "../case-study/case-study.model.js";
import { DesignModel } from "../design/design.model.js";

export const getDashboard = async (c: Context<AppEnv>) => {
  try {
    const [projectCount, blogCount, bookCount, caseStudyCount, designCount] = await Promise.all([
      ProjectModel.countDocuments(),
      BlogModel.countDocuments(),
      BookModel.countDocuments(),
      CaseStudyModel.countDocuments(),
      DesignModel.countDocuments(),
    ]);

    return c.json({
      success: true,
      metrics: {
        totalProjects: projectCount,
        totalBlogs: blogCount,
        totalBooks: bookCount,
        totalCaseStudies: caseStudyCount,
        totalDesigns: designCount,
      },
      stats: [
        { label: "Projects", value: projectCount },
        { label: "Blog Posts", value: blogCount },
        { label: "Books", value: bookCount },
        { label: "Case Studies", value: caseStudyCount },
        { label: "Designs", value: designCount },
      ],
      messages: [],
      notifications: [],
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const getMessages = async (c: Context<AppEnv>) => {
  return c.json([]);
};

export const getNotifications = async (c: Context<AppEnv>) => {
  return c.json([]);
};
