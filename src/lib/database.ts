import { MongoClient } from "mongodb";
import mongoose from "mongoose";

import { env } from "./env";
import { ProjectModel } from "../models/project.model";

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

const seedInitialProjects = async () => {
  try {
    const count = await ProjectModel.countDocuments();
    if (count === 0) {
      console.log("Seeding initial projects into MongoDB...");
      const initialProjects = [
        {
          title: "বন্টন",
          slug: "bonton",
          description: "Split any shared cost, then settle with fewer payments. Local-first expense splitter for trips, food, rent, or any shared resource.",
          coverImage: "/images/project/bonton.png",
          logo: "/images/project/logo/bonton.png",
          stack: ["React", "TypeScript", "Zustand", "Tailwind CSS", "Vite"],
          coreFeatures: [
            { icon: "receipt", text: "Add Expense", desc: "Track total cost with multiple initial payers" },
            { icon: "users", text: "Assign Payers", desc: "Multiple people can share the initial payment" },
            { icon: "user-check", text: "Choose Participants", desc: "Select who owes what in each expense" },
            { icon: "split", text: "Flexible Split", desc: "Equal, percentage, or fixed-amount splits" },
            { icon: "file-down", text: "Export Settlements", desc: "Copy or export optimised settlement report" }
          ],
          gitRepo: "https://github.com/abdullahmaksud/bonton",
          liveLink: "https://bonton.abdullahalmaksud.com",
          categories: ["saas", "finance", "tool"],
          tag: "Local-first settlement system",
          createdAt: "2025-11-01",
          lastUpdate: "2026-05-20",
          isFeatured: true,
          isArchived: false,
          status: "live"
        },
        {
          title: "পৃষ্ঠা",
          slug: "prishtha",
          description: "A distraction-free writing workspace. Write, save, print, and export your work — no account required, everything stays in your browser.",
          coverImage: "/images/project/prishtha.png",
          logo: "/images/project/logo/prishtha.png",
          stack: ["React", "TypeScript", "LocalStorage", "Tailwind CSS", "Vite"],
          coreFeatures: [
            { icon: "pen-line", text: "Minimal Editor", desc: "Clean title + body writing surface with zero clutter" },
            { icon: "save", text: "Save As", desc: "Name and persist drafts locally in the browser" },
            { icon: "printer", text: "Print", desc: "Send your writing directly to the printer" },
            { icon: "download", text: "Export", desc: "Download as plain text or formatted document" },
            { icon: "bar-chart-2", text: "Word Count", desc: "Live character and word count in the status bar" }
          ],
          gitRepo: "https://github.com/abdullahmaksud/prishtha",
          liveLink: "https://prishtha.abdullahalmaksud.com",
          categories: ["writing", "tool", "productivity"],
          tag: "Distraction-free editor",
          createdAt: "2025-08-15",
          lastUpdate: "2026-04-10",
          isFeatured: true,
          isArchived: false,
          status: "case-study"
        },
        {
          title: "শিশুশিক্ষা",
          slug: "okkhor",
          description: "Interactive Bengali alphabet and rhymes learning app for children. Learn বর্ণমালা through pictures, sounds, and playful games.",
          coverImage: "/images/project/okkhor.png",
          logo: "/images/project/logo/okkhor.png",
          stack: ["React", "TypeScript", "Framer Motion", "Tailwind CSS", "Howler.js"],
          coreFeatures: [
            { icon: "book-open", text: "বর্ণমালা", desc: "স্বরবর্ণ ও ব্যঞ্জনবর্ণ with animated picture cards" },
            { icon: "mic", text: "Audio Pronunciation", desc: "Native audio for each letter and word" },
            { icon: "music", text: "ছড়া-কবিতা", desc: "Classic Bengali nursery rhymes with illustrations" },
            { icon: "gamepad-2", text: "Interactive Games", desc: "Match letters, trace, and identify sounds" },
            { icon: "star", text: "Progress Tracking", desc: "Stars and badges to encourage continued learning" }
          ],
          gitRepo: "https://github.com/abdullahmaksud/shishushikkha",
          liveLink: "https://okkhor.abdullahalmaksud.com",
          categories: ["education", "kids", "bengali"],
          tag: "Bengali learning for children",
          createdAt: "2025-06-01",
          lastUpdate: "2026-03-18",
          isFeatured: true,
          isArchived: false,
          status: "live"
        },
        {
          title: "Ghorial",
          slug: "ghorial",
          description: "A minimal, full-screen clock and focus tool. Clock, stopwatch, countdown, and Pomodoro modes in one distraction-free interface.",
          coverImage: "/images/project/ghorial.png",
          logo: "/images/project/logo/ghorial.png",
          stack: ["React", "TypeScript", "Framer Motion", "Tailwind CSS", "Zustand"],
          coreFeatures: [
            { icon: "clock", text: "World Clock", desc: "Full-screen live clock with date display" },
            { icon: "coffee", text: "Pomodoro", desc: "25/5 focus sessions with visual progress" },
            { icon: "timer", text: "Stopwatch", desc: "Precision lap stopwatch" },
            { icon: "hourglass", text: "Countdown", desc: "Custom countdown timer with alerts" },
            { icon: "pin", text: "Pinnable Sidebar", desc: "Minimal vertical nav with auto-hide and pin support" }
          ],
          gitRepo: "https://github.com/abdullahmaksud/focustimer",
          liveLink: "https://timer-tools-rho.vercel.app/",
          categories: ["productivity", "tool", "ui"],
          tag: "Minimal focus & time tool",
          createdAt: "2025-03-10",
          lastUpdate: "2026-06-01",
          isFeatured: false,
          isArchived: false,
          status: "prototype"
        }
      ];

      await ProjectModel.create(initialProjects);
      console.log("Seeding complete!");
    }
  } catch (error) {
    console.error("Seeding failed:", error);
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
        seedInitialProjects().catch((err) => console.error("Seeding error:", err));
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
