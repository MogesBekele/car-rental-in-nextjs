// src/pages/api/user/cars.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Car from "@/models/Car";
import connectDB from "@/lib/db";
const getCars = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    await connectDB();
    const cars = await Car.find({ isAvailable: true });
    res.status(200).json({ success: true, cars });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default getCars;
