import type { Context } from "hono";

import type { AppEnv } from "../../lib/types.js";
import { CaseStudyModel } from "./case-study.model.js";
import {
  createCaseStudySchema,
  updateCaseStudySchema,
} from "./case-study.validation.js";

export const getAllCaseStudies = async (c: Context<AppEnv>) => {
  try {
    const page = Math.max(1, Number(c.req.query("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(c.req.query("limit")) || 20));
    const skip = (page - 1) * limit;

    const publishedOnly = c.req.query("published");
    const category = c.req.query("category");
    const industry = c.req.query("industry");
    const featured = c.req.query("featured");
    const projectSlug = c.req.query("projectSlug");
    const search = c.req.query("search");
    const includeContent = c.req.query("includeContent") === "true";

    const filter: Record<string, any> = {};

    if (publishedOnly === "true") {
      filter.isPublished = true;
    } else if (publishedOnly === "false") {
      filter.isPublished = false;
    }

    if (category && category.toLowerCase() !== "all") {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (industry) {
      filter.industry = { $regex: new RegExp(`^${industry}$`, "i") };
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (projectSlug) {
      filter.projectSlug = projectSlug;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { client: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { stack: { $regex: search, $options: "i" } },
      ];
    }

    const projection = includeContent ? {} : { content: 0 };

    const [caseStudies, total] = await Promise.all([
      CaseStudyModel.find(filter, projection)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CaseStudyModel.countDocuments(filter),
    ]);

    return c.json({
      success: true,
      data: caseStudies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const getCaseStudyBySlug = async (c: Context<AppEnv>) => {
  try {
    const slug = c.req.param("slug");
    const caseStudy = await CaseStudyModel.findOne({ slug });

    if (!caseStudy) {
      return c.json({ success: false, message: "Case study not found" }, 404);
    }

    return c.json({ success: true, data: caseStudy });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const getCaseStudyById = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const caseStudy = await CaseStudyModel.findById(id);

    if (!caseStudy) {
      return c.json({ success: false, message: "Case study not found" }, 404);
    }

    return c.json({ success: true, data: caseStudy });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const createCaseStudy = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.json();
    const parsed = createCaseStudySchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.format(),
        },
        400
      );
    }

    const existing = await CaseStudyModel.findOne({ slug: parsed.data.slug });
    if (existing) {
      return c.json(
        { success: false, message: "Case study with this slug already exists" },
        400
      );
    }

    const caseStudy = new CaseStudyModel(parsed.data);
    await caseStudy.save();
    return c.json({ success: true, data: caseStudy }, 201);
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const updateCaseStudy = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const parsed = updateCaseStudySchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.format(),
        },
        400
      );
    }

    const caseStudy = await CaseStudyModel.findById(id);
    if (!caseStudy) {
      return c.json({ success: false, message: "Case study not found" }, 404);
    }

    if (parsed.data.slug && parsed.data.slug !== caseStudy.slug) {
      const existing = await CaseStudyModel.findOne({ slug: parsed.data.slug });
      if (existing) {
        return c.json(
          { success: false, message: "Case study with this slug already exists" },
          400
        );
      }
    }

    Object.assign(caseStudy, parsed.data);
    await caseStudy.save();

    return c.json({ success: true, data: caseStudy });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const deleteCaseStudy = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const caseStudy = await CaseStudyModel.findByIdAndDelete(id);
    if (!caseStudy) {
      return c.json({ success: false, message: "Case study not found" }, 404);
    }
    return c.json({
      success: true,
      message: "Case study deleted successfully",
    });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};
