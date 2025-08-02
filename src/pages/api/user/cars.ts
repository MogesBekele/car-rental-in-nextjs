// pages/api/user/cars.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import Car from "@/models/Car";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: user._id });
    return res.status(200).json({ success: true, cars });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
