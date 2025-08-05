import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Car from "@/models/Car";
import Booking from "@/models/Booking";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    await connectDB();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const cars = await Car.find({ owner: decoded.userId });
    const bookings = await Booking.find({ owner: decoded.userId }).populate(
      "car"
    );
    const confirmed = bookings.filter((b) => b.status === "confirmed");
    const pending = bookings.filter((b) => b.status === "pending");

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pending.length,
      completedBookings: confirmed.length,
      recentBookings: bookings.slice(0, 5),
      monthlyRevenue: confirmed.reduce((sum, b) => sum + b.price, 0),
    };

    return res.status(200).json({ success: true, dashboardData });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
