import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("❌ MONGODB_URI not found");

  try {
    await mongoose.connect(uri, {
      dbName: "car-rental-in-nextjs",
      bufferCommands: false,
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB failed:", err);
    throw new Error("MongoDB connection error");
  }
};

export default connectDB;
