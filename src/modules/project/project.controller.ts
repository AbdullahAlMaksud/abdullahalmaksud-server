import type { Context } from "hono";

import type { AppEnv } from "../../lib/types.js";
import { ProjectModel } from "./project.model.js";
import { createProjectSchema, updateProjectSchema } from "./project.validation.js";

export const getAllProjects = async (c: Context<AppEnv>) => {
  try {
    const pageParam = c.req.query("page");
    const limitParam = c.req.query("limit");
    const isPaginated = pageParam !== undefined || limitParam !== undefined;

    const page = Math.max(1, Number(pageParam) || 1);
    const limit = Math.min(100, Math.max(1, Number(limitParam) || 20));
    const skip = (page - 1) * limit;

    const category = c.req.query("category");
    const featured = c.req.query("featured");
    const status = c.req.query("status");
    const search = c.req.query("search");

    const filter: Record<string, any> = {};

    if (category && category.toLowerCase() !== "all") {
      filter.$or = [
        { category: { $regex: new RegExp(`^${category}$`, "i") } },
        { tags: { $in: [new RegExp(`^${category}$`, "i")] } },
        { stack: { $in: [new RegExp(`^${category}$`, "i")] } },
      ];
    }

    if (featured === "true") {
      filter.featured = true;
    } else if (featured === "false") {
      filter.featured = false;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      const searchFilter = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { longDescription: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { stack: { $regex: search, $options: "i" } },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchFilter }];
        delete filter.$or;
      } else {
        filter.$or = searchFilter;
      }
    }

    const query = ProjectModel.find(filter).sort({ sortOrder: 1, createdAt: -1 });

    if (isPaginated) {
      const [projects, total] = await Promise.all([
        query.skip(skip).limit(limit),
        ProjectModel.countDocuments(filter),
      ]);

      return c.json({
        success: true,
        data: projects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    const projects = await query;
    return c.json({
      success: true,
      data: projects,
      pagination: {
        page: 1,
        limit: projects.length,
        total: projects.length,
        totalPages: 1,
      },
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Database query failed",
        error: (error as Error).message,
      },
      500
    );
  }
};

export const getProjectBySlug = async (c: Context<AppEnv>) => {
  try {
    const slug = c.req.param("slug");
    const project = await ProjectModel.findOne({ slug });

    if (!project) {
      return c.json({ success: false, message: "Project not found" }, 404);
    }

    const json = project.toJSON();
    // Dual format support: works both for res.data (ApiResponse) and res (direct Project)
    return c.json({
      ...json,
      success: true,
      data: json,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Database query failed",
        error: (error as Error).message,
      },
      500
    );
  }
};

export const getProjectById = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const project = await ProjectModel.findById(id);

    if (!project) {
      return c.json({ success: false, message: "Project not found" }, 404);
    }

    const json = project.toJSON();
    return c.json({
      ...json,
      success: true,
      data: json,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Database query failed",
        error: (error as Error).message,
      },
      500
    );
  }
};

export const createProject = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.json();
    const parsed = createProjectSchema.safeParse(body);

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

    const existing = await ProjectModel.findOne({ slug: parsed.data.slug });
    if (existing) {
      return c.json(
        { success: false, message: "Project with this slug already exists" },
        400
      );
    }

    const project = new ProjectModel(parsed.data);
    await project.save();
    return c.json({ success: true, data: project }, 201);
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const updateProject = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const parsed = updateProjectSchema.safeParse(body);

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

    const project = await ProjectModel.findById(id);
    if (!project) {
      return c.json({ success: false, message: "Project not found" }, 404);
    }

    if (parsed.data.slug && parsed.data.slug !== project.slug) {
      const existing = await ProjectModel.findOne({ slug: parsed.data.slug });
      if (existing) {
        return c.json(
          { success: false, message: "Project with this slug already exists" },
          400
        );
      }
    }

    Object.assign(project, parsed.data);
    await project.save();

    return c.json({ success: true, data: project });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};

export const deleteProject = async (c: Context<AppEnv>) => {
  try {
    const id = c.req.param("id");
    const project = await ProjectModel.findByIdAndDelete(id);
    if (!project) {
      return c.json({ success: false, message: "Project not found" }, 404);
    }
    return c.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500);
  }
};
