import dns from "node:dns";
import mongoose from "mongoose";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // Ignore if dns setting is restricted
}

import { env } from "./env.js";
import { log } from "./logger.js";
import { BlogModel } from "../modules/blog/blog.model.js";
import { BookBundleModel, BookModel } from "../modules/book/book.model.js";
import { DesignModel } from "../modules/design/design.model.js";
import { HomeModel } from "../modules/home/home.model.js";
import { AboutModel } from "../modules/about/about.model.js";
import { ProjectModel } from "../modules/project/project.model.js";
import { CaseStudyModel } from "../modules/case-study/case-study.model.js";

// Static JSON fixtures
import homeData from "../data/home.json" with { type: "json" };
import aboutData from "../data/about.json" with { type: "json" };
import projectsData from "../data/projects.json" with { type: "json" };
import blogsData from "../data/blogs.json" with { type: "json" };
import blogDetailsData from "../data/blog-details.json" with { type: "json" };
import bookData from "../data/book.json" with { type: "json" };
import designsData from "../data/designs.json" with { type: "json" };

const connectionStates: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cachedMongoose: MongooseCache = globalThis.mongooseCache || { conn: null, promise: null };
if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cachedMongoose;
}

/**
 * Returns the native MongoClient from the existing Mongoose connection.
 * Must be called AFTER connectDatabase() has resolved.
 * Reusing Mongoose's connection avoids a second cold-start round-trip to Atlas.
 */
export const getAuthMongoClient = () => {
  const client = (mongoose.connection as any).client;
  if (!client) throw new Error("Mongoose not connected — call connectDatabase() first");
  return client;
};

export const getAuthDb = () => getAuthMongoClient().db(env.MONGODB_DB_NAME);

export const seedAllInitialData = async () => {
  try {
    // 1. Projects
    const projectCount = await ProjectModel.countDocuments();
    if (projectCount === 0) {
      log.seedStart("Projects");
      await ProjectModel.create(projectsData.projects);
      log.seedDone("Projects");
    }

    // 2. Blogs & Blog Details
    const blogCount = await BlogModel.countDocuments();
    if (blogCount === 0) {
      log.seedStart("Blogs");
      const detailsMap = new Map((blogDetailsData.blogDetails as any[]).map((d) => [d.slug, d]));
      
      const mergedBlogs = blogsData.blogs.map((b) => {
        const detail = detailsMap.get(b.slug);
        return {
          id: b.id,
          slug: b.slug,
          title: b.title,
          excerpt: b.excerpt,
          category: b.category,
          publishedAt: b.publishedAt,
          readingTime: b.readingTime,
          featured: b.featured,
          featuredType: b.featuredType,
          cover: b.cover,
          coverImage: b.cover,
          author: detail?.author || {
            name: "Abdullah Al Maksud",
            avatar: "/images/avatar.jpg",
            bio: "Developer, designer, writer.",
          },
          tags: detail?.tags || [b.category],
          content: detail?.content || b.excerpt,
          isPublished: true,
        };
      });

      // Add detail posts that were not in summary
      for (const d of blogDetailsData.blogDetails as any[]) {
        if (!mergedBlogs.some((b) => b.slug === d.slug)) {
          mergedBlogs.push({
            id: d.slug,
            slug: d.slug,
            title: d.title,
            excerpt: d.excerpt,
            category: d.category,
            publishedAt: d.publishedAt,
            readingTime: d.readingTime,
            featured: false,
            featuredType: "",
            cover: d.cover,
            coverImage: d.cover,
            author: d.author,
            tags: d.tags,
            content: d.content,
            isPublished: true,
          });
        }
      }

      await BlogModel.create(mergedBlogs);
      log.seedDone("Blogs");
    }

    // 3. Books & Bundle
    const bundleCount = await BookBundleModel.countDocuments();
    if (bundleCount === 0) {
      log.seedStart("Books");
      await BookBundleModel.create({
        key: "main",
        book: bookData.book,
        stats: bookData.stats,
        books: bookData.books,
      });
      log.seedDone("Books");
    }

    // 4. Designs
    const designCount = await DesignModel.countDocuments();
    if (designCount === 0) {
      log.seedStart("Designs");
      await DesignModel.create(designsData.designs);
      log.seedDone("Designs");
    }

    // 5. Home Configuration
    const homeCount = await HomeModel.countDocuments();
    if (homeCount === 0) {
      log.seedStart("Home Config");
      await HomeModel.create({
        key: "main",
        ...homeData,
      });
      log.seedDone("Home Config");
    }

    // 6. About Configuration
    const aboutCount = await AboutModel.countDocuments();
    if (aboutCount === 0) {
      log.seedStart("About Config");
      await AboutModel.create({
        key: "main",
        ...aboutData,
      });
      log.seedDone("About Config");
    }
  } catch (error) {
    log.seedError(error);
  }
};

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cachedMongoose.promise) {
    mongoose.set("strictQuery", true);
    const opts: mongoose.ConnectOptions = {
      dbName: env.MONGODB_DB_NAME,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 10000,
    };

    cachedMongoose.promise = mongoose
      .connect(env.MONGODB_URI, opts)
      .then((m) => {
        seedAllInitialData().catch((err) => console.error("Auto-seeding error:", err));
        return m;
      })
      .catch((error) => {
        cachedMongoose.promise = null;
        throw error;
      });
  }

  try {
    cachedMongoose.conn = await cachedMongoose.promise;
  } catch (error) {
    cachedMongoose.promise = null;
    throw error;
  }

  return mongoose.connection;
};

export const connectDatabases = async () => {
  await connectDatabase();
  // No separate auth DB connection needed — BetterAuth reuses the Mongoose MongoClient
};

export const isDatabaseConnectionError = (error: unknown) => {
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message : String(error);

  return (
    name === "MongoServerSelectionError" ||
    name === "MongooseServerSelectionError" ||
    message.includes("Could not connect to any servers") ||
    message.includes("ECONNREFUSED") ||
    message.includes("ReplicaSetNoPrimary") ||
    message.includes("Server selection timed out") ||
    message.includes("Topology is closed")
  );
};

/** True once Mongoose (and therefore auth DB) is connected. */
export const isAuthDatabaseConnected = () => mongoose.connection.readyState === 1;

/** No-op — kept for interface compatibility; auth uses Mongoose connection. */
export const markAuthDatabaseDisconnected = () => {
  // Intentionally empty: auth DB is Mongoose, disconnection handled by Mongoose events
};

export const getDatabaseConnectionHelp = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("MongoDB Atlas") || env.MONGODB_URI.startsWith("mongodb+srv://")) {
    return [
      "MongoDB Atlas is unreachable from this machine.",
      "Add your current IP address in Atlas Network Access, or switch local development to MongoDB with:",
      "MONGODB_URI=mongodb://127.0.0.1:27017/abdullahalmaksud",
      "Then start the local database with: docker compose up -d",
    ].join(" ");
  }

  return [
    "MongoDB is unreachable.",
    "Check that the database is running and that MONGODB_URI points to the correct host.",
  ].join(" ");
};

export const getDatabaseStatus = () => ({
  name: mongoose.connection.name || env.MONGODB_DB_NAME,
  state: connectionStates[mongoose.connection.readyState] ?? "unknown",
});

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  cachedMongoose.promise = null;
  cachedMongoose.conn = null;
};

