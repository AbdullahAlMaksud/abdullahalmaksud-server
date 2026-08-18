import { MongoClient } from "mongodb";
import mongoose from "mongoose";

import { env } from "./env.js";
import { BlogModel } from "../modules/blog/blog.model.js";
import { BookModel } from "../modules/book/book.model.js";
import { ProjectModel } from "../modules/project/project.model.js";

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

const seedInitialBlogs = async () => {
  try {
    const count = await BlogModel.countDocuments();
    if (count === 0) {
      console.log("Seeding initial blog posts into MongoDB...");
      const initialBlogs = [
        {
          title: "কেন আমি Local-first অ্যাপ বানাই",
          slug: "why-i-build-local-first-apps",
          content: "# Local-first কেন?\n\nআধুনিক ওয়েব অ্যাপ্লিকেশনে ইউজার ডাটা সার্ভারে পাঠানো একটি সাধারণ প্র্যাকটিস। কিন্তু Local-first অ্যাপ্রোচে ডাটা প্রথমে ব্রাউজারে থাকে, তারপর প্রয়োজনে সিঙ্ক হয়।\n\n## সুবিধা\n- দ্রুত পারফরমেন্স\n- অফলাইন সাপোর্ট\n- প্রাইভেসি\n\nবন্টন এবং পৃষ্ঠা — দুটোই এই ফিলোসফি ফলো করে।",
          excerpt: "কেন সার্ভারলেস নয়, কেন Local-first? আমার ডেভেলপমেন্ট ফিলোসফি নিয়ে আলোচনা।",
          coverImage: "/images/blog/local-first.png",
          author: "Abdullah Al Maksud",
          tags: ["local-first", "web-development", "philosophy"],
          category: "Development",
          isPublished: true,
          publishedAt: "2026-07-15",
        },
        {
          title: "React Performance Optimization Tips",
          slug: "react-performance-optimization-tips",
          content: "# React Performance\n\nReact অ্যাপ্লিকেশন দ্রুত করার জন্য কিছু প্রমাণিত টেকনিক:\n\n## 1. useMemo ও useCallback\n\n```tsx\nconst memoizedValue = useMemo(() => computeExpensive(a, b), [a, b]);\n```\n\n## 2. React.lazy\n\nCode splitting দিয়ে initial bundle সাইজ কমানো যায়।\n\n## 3. Virtual Lists\n\nবড় লিস্টের জন্য `react-window` বা `@tanstack/virtual` ব্যবহার করুন।",
          excerpt: "React অ্যাপ স্লো? এই ৫টি কৌশল দিয়ে পারফরমেন্স বাড়ান।",
          coverImage: "/images/blog/react-perf.png",
          author: "Abdullah Al Maksud",
          tags: ["react", "performance", "javascript"],
          category: "Tutorial",
          isPublished: true,
          publishedAt: "2026-06-20",
        },
        {
          title: "TypeScript দিয়ে Backend: Hono vs Express",
          slug: "typescript-backend-hono-vs-express",
          content: "# Hono vs Express\n\nHono একটি আল্ট্রা-ফাস্ট, এজ-ফার্স্ট ওয়েব ফ্রেমওয়ার্ক। Express এর তুলনায় কেন আমি Hono পছন্দ করি:\n\n## টাইপ সেফটি\nHono-তে TypeScript ফার্স্ট-ক্লাস সিটিজেন।\n\n## পারফরমেন্স\nBenchmark-এ Hono Express এর চেয়ে ৫-১০x দ্রুত।\n\n## এজ ডিপ্লয়মেন্ট\nVercel, Cloudflare Workers, Deno — সব জায়গায় চলে।",
          excerpt: "Express ছেড়ে Hono কেন? TypeScript ব্যাকেন্ডের জন্য সেরা চয়েস।",
          coverImage: "/images/blog/hono-vs-express.png",
          author: "Abdullah Al Maksud",
          tags: ["typescript", "hono", "express", "backend"],
          category: "Comparison",
          isPublished: false,
          publishedAt: "",
        },
      ];

      await BlogModel.create(initialBlogs);
      console.log("Blog seeding complete!");
    }
  } catch (error) {
    console.error("Blog seeding failed:", error);
  }
};

const seedInitialBooks = async () => {
  try {
    const count = await BookModel.countDocuments();
    if (count === 0) {
      console.log("Seeding initial books into MongoDB...");
      const initialBooks = [
        {
          title: "Clean Code",
          slug: "clean-code",
          author: "Robert C. Martin",
          coverImage: "/images/books/clean-code.png",
          description: "A Handbook of Agile Software Craftsmanship. কোড লেখার আর্ট শেখায় এই বই — কিভাবে রিডেবল, মেইনটেইনেবল কোড লিখতে হয়।",
          genre: "Software Engineering",
          rating: 5,
          readDate: "2024-03-15",
          reviewText: "প্রতিটি ডেভেলপারের অবশ্যপাঠ্য। নামকরণ, ফাংশন ডিজাইন, এরর হ্যান্ডলিং — সব বিষয়ে গভীর ইনসাইট।",
          tags: ["programming", "best-practices", "craftsmanship"],
          isRecommended: true,
          purchaseLink: "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882",
        },
        {
          title: "The Pragmatic Programmer",
          slug: "the-pragmatic-programmer",
          author: "David Thomas, Andrew Hunt",
          coverImage: "/images/books/pragmatic-programmer.png",
          description: "From Journeyman to Master. ডেভেলপার হিসেবে ক্যারিয়ার গড়ার প্র্যাক্টিকাল গাইড।",
          genre: "Software Engineering",
          rating: 5,
          readDate: "2024-06-10",
          reviewText: "DRY, orthogonality, tracer bullets — এই কনসেপ্টগুলো আমার চিন্তার ধারা পাল্টে দিয়েছে।",
          tags: ["programming", "career", "philosophy"],
          isRecommended: true,
          purchaseLink: "https://www.amazon.com/Pragmatic-Programmer-journey-mastery/dp/0135957052",
        },
        {
          title: "দেয়াল",
          slug: "deyal",
          author: "হুমায়ূন আহমেদ",
          coverImage: "/images/books/deyal.png",
          description: "বাংলাদেশের স্বাধীনতা যুদ্ধ ও রাজনৈতিক ইতিহাসের উপর ভিত্তি করে লেখা ঐতিহাসিক উপন্যাস।",
          genre: "Historical Fiction",
          rating: 4,
          readDate: "2025-01-20",
          reviewText: "বাংলাদেশের ইতিহাস বুঝতে হলে এই বইটি পড়া উচিত। হুমায়ূন আহমেদের অন্যতম সেরা কাজ।",
          tags: ["bengali", "history", "novel"],
          isRecommended: true,
          purchaseLink: "",
        },
      ];

      await BookModel.create(initialBooks);
      console.log("Book seeding complete!");
    }
  } catch (error) {
    console.error("Book seeding failed:", error);
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
        seedInitialProjects().catch((err) => console.error("Project seeding error:", err));
        seedInitialBlogs().catch((err) => console.error("Blog seeding error:", err));
        seedInitialBooks().catch((err) => console.error("Book seeding error:", err));
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
