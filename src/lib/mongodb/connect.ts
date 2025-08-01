import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("❌ MONGODB_URI not found in environment variables.");
  }

  try {
    await mongoose.connect(uri, {
      dbName: "car-rental-in-nextjs",  // Optional: your database name
      bufferCommands: false,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw new Error("MongoDB connection failed");
  }
};

export default connectDB;
