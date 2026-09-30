import mongoose from "mongoose";

let cachedConnection: typeof mongoose | null = null;
let cachedConnectionPromise: Promise<typeof mongoose> | null = null;

const connectDB = async (): Promise<typeof mongoose> => {
  // Already connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  // Connection is already being established
  if (cachedConnectionPromise) {
    return cachedConnectionPromise;
  }

  try {
    cachedConnectionPromise = mongoose.connect(
      process.env.MONGO_URI as string,
      {
        serverSelectionTimeoutMS: 5000,
      },
    );

    cachedConnection = await cachedConnectionPromise;

    console.log("MongoDB connected successfully");

    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    cachedConnectionPromise = null;

    console.error(
      "MongoDB connection failed:",
      error instanceof Error ? error.message : error,
    );

    throw error;
  }
};

export default connectDB;