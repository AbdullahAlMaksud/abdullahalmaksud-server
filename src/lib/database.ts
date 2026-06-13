import { MongoClient } from "mongodb";
import mongoose from "mongoose";

import { env } from "./env";

const connectionStates: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

let mongooseConnectionPromise: Promise<typeof mongoose> | null = null;
let authConnectionPromise: Promise<MongoClient> | null = null;
let authDatabaseConnected = false;

export const authMongoClient = new MongoClient(env.MONGODB_URI);
export const authDb = authMongoClient.db(env.MONGODB_DB_NAME);

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongooseConnectionPromise ??= mongoose
    .connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 5000,
    })
    .catch((error) => {
      mongooseConnectionPromise = null;
      throw error;
    });

  await mongooseConnectionPromise;
  return mongoose.connection;
};

export const connectAuthDatabase = async () => {
  authConnectionPromise ??= authMongoClient
    .connect()
    .then((client) => {
      authDatabaseConnected = true;
      return client;
    })
    .catch((error) => {
      authDatabaseConnected = false;
      authConnectionPromise = null;
      throw error;
    });

  return authConnectionPromise;
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
  authConnectionPromise = null;
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
  mongooseConnectionPromise = null;
  authConnectionPromise = null;
};
