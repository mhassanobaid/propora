import mongoose from "mongoose";

let cachedConnection = null;
let cachedConnectionPromise = null;

export const connectDB = async () => {
  // Already connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  // Connection is already being established
  if (cachedConnectionPromise) {
    return cachedConnectionPromise;
  }

  try {
    cachedConnectionPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    cachedConnection = await cachedConnectionPromise;

    console.log("MongoDB connected successfully");

    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    cachedConnectionPromise = null;

    console.error("MongoDB connection failed:", error.message);

    throw error;
  }
};
