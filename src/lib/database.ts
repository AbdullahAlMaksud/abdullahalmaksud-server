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

export const authMongoClient = new MongoClient(env.MONGODB_URI);
export const authDb = authMongoClient.db(env.MONGODB_DB_NAME);

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongooseConnectionPromise ??= mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DB_NAME,
    serverSelectionTimeoutMS: 5000,
  });

  await mongooseConnectionPromise;
  return mongoose.connection;
};

export const connectAuthDatabase = async () => {
  authConnectionPromise ??= authMongoClient.connect();
  return authConnectionPromise;
};

export const getDatabaseStatus = () => ({
  name: mongoose.connection.name || env.MONGODB_DB_NAME,
  state: connectionStates[mongoose.connection.readyState] ?? "unknown",
});

export const disconnectDatabase = async () => {
  await Promise.allSettled([mongoose.disconnect(), authMongoClient.close()]);
  mongooseConnectionPromise = null;
  authConnectionPromise = null;
};
