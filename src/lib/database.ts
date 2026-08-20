import dns from "node:dns";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // Ignore if dns setting is restricted
}

import { env } from "./env.js";
import { BlogModel } from "../modules/blog/blog.model.js";
import { BookBundleModel, BookModel } from "../modules/book/book.model.js";
import { DesignModel } from "../modules/design/design.model.js";
import { HomeModel } from "../modules/home/home.model.js";
import { AboutModel } from "../modules/about/about.model.js";
import { ProjectModel } from "../modules/project/project.model.js";

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

interface AuthCache {
  conn: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
  // eslint-disable-next-line no-var
  var authCache: AuthCache | undefined;
}

let cachedMongoose: MongooseCache = globalThis.mongooseCache || { conn: null, promise: null };
if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cachedMongoose;
}

let cachedAuth: AuthCache = globalThis.authCache || { conn: null, promise: null };
if (!globalThis.authCache) {
  globalThis.authCache = cachedAuth;
}

let authDatabaseConnected = false;

export const authMongoClient = new MongoClient(env.MONGODB_URI);
export const authDb = authMongoClient.db(env.MONGODB_DB_NAME);

export const seedAllInitialData = async () => {
  try {
    // 1. Projects
    const projectCount = await ProjectModel.countDocuments();
    if (projectCount === 0) {
      console.log("Seeding initial projects into MongoDB...");
      await ProjectModel.create(projectsData.projects);
      console.log("Project seeding complete!");
    }

    // 2. Blogs & Blog Details
    const blogCount = await BlogModel.countDocuments();
    if (blogCount === 0) {
      console.log("Seeding initial blog posts into MongoDB...");
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
      console.log("Blog seeding complete!");
    }

    // 3. Books & Bundle
    const bundleCount = await BookBundleModel.countDocuments();
    if (bundleCount === 0) {
      console.log("Seeding initial book bundle into MongoDB...");
      await BookBundleModel.create({
        key: "main",
        book: bookData.book,
        stats: bookData.stats,
        books: bookData.books,
      });
      console.log("Book bundle seeding complete!");
    }

    // 4. Designs
    const designCount = await DesignModel.countDocuments();
    if (designCount === 0) {
      console.log("Seeding initial graphic designs into MongoDB...");
      await DesignModel.create(designsData.designs);
      console.log("Design seeding complete!");
    }

    // 5. Home Configuration
    const homeCount = await HomeModel.countDocuments();
    if (homeCount === 0) {
      console.log("Seeding initial home configuration into MongoDB...");
      await HomeModel.create({
        key: "main",
        ...homeData,
      });
      console.log("Home configuration seeding complete!");
    }

    // 6. About Configuration
    const aboutCount = await AboutModel.countDocuments();
    if (aboutCount === 0) {
      console.log("Seeding initial about configuration into MongoDB...");
      await AboutModel.create({
        key: "main",
        ...aboutData,
      });
      console.log("About configuration seeding complete!");
    }
  } catch (error) {
    console.error("Auto-seeding check error:", error);
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

export const connectAuthDatabase = async () => {
  if (!cachedAuth.promise) {
    cachedAuth.promise = authMongoClient
      .connect()
      .then((client) => {
        authDatabaseConnected = true;
        return client;
      })
      .catch((error) => {
        authDatabaseConnected = false;
        cachedAuth.promise = null;
        throw error;
      });
  }

  try {
    cachedAuth.conn = await cachedAuth.promise;
    authDatabaseConnected = true;
  } catch (error) {
    authDatabaseConnected = false;
    cachedAuth.promise = null;
    throw error;
  }

  return cachedAuth.promise;
};

export const connectDatabases = async () => {
  await connectDatabase();
  await connectAuthDatabase();
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

export const isAuthDatabaseConnected = () => authDatabaseConnected;

export const markAuthDatabaseDisconnected = () => {
  authDatabaseConnected = false;
  cachedAuth.promise = null;
  cachedAuth.conn = null;
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
  await Promise.allSettled([mongoose.disconnect(), authMongoClient.close()]);
  authDatabaseConnected = false;
  cachedMongoose.promise = null;
  cachedMongoose.conn = null;
  cachedAuth.promise = null;
  cachedAuth.conn = null;
};
