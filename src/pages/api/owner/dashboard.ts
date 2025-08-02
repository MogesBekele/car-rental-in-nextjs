// pages/api/owner/dashboard.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import Car from "@/models/Car";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Example: count how many cars this owner has
    const carCount = await Car.countDocuments({ owner: user._id });

    res.status(200).json({
      success: true,
      data: {
        carCount,
        message: "Dashboard data loaded",
      },
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
