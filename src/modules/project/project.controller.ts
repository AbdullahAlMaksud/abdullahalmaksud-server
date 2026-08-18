import type { Context } from "hono";

import type { AppEnv } from "../../lib/types.js";
import { ProjectModel } from "./project.model.js";

export const getAllProjects = async (c: Context<AppEnv>) => {
  try {
    const projects = await ProjectModel.find().sort({ createdAt: -1 });
    return c.json(projects);
  } catch (error) {
    return c.json({ success: false, message: "Database query failed" }, 500);
  }
};

export const getProjectBySlug = async (c: Context<AppEnv>) => {
  try {
    const slug = c.req.param("slug");
    const project = await ProjectModel.findOne({ slug });

    if (!project) {
      return c.json({ success: false, message: "Project not found" }, 404);
    }

    return c.json(project);
  } catch (error) {
    return c.json({ success: false, message: "Database query failed" }, 500);
  }
};

export const createProject = async (c: Context<AppEnv>) => {
  try {
    const body = await c.req.json();

    const existing = await ProjectModel.findOne({ slug: body.slug });
    if (existing) {
      return c.json({ success: false, message: "Project with this slug already exists" }, 400);
    }

    const project = new ProjectModel(body);
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

    const project = await ProjectModel.findById(id);
    if (!project) {
      return c.json({ success: false, message: "Project not found" }, 404);
    }

    if (body.slug && body.slug !== project.slug) {
      const existing = await ProjectModel.findOne({ slug: body.slug });
      if (existing) {
        return c.json({ success: false, message: "Project with this slug already exists" }, 400);
      }
    }

    Object.assign(project, body);
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
