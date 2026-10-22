import dns from "node:dns";
import mongoose from "mongoose";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (_e) {
  // Ignore if dns setting is restricted
}

import { env } from "./env.js";

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

const cachedMongoose: MongooseCache = globalThis.mongooseCache || { conn: null, promise: null };
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
      .then((m) => m)
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
