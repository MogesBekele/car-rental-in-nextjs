import type { NextApiResponse } from "next";
import { NextApiRequestWithUser } from "@/types/nextApiRequestWithUser";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import Booking from "@/models/Booking";
import { protect } from "@/lib/auth";

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    await connectDB();

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });

    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = await Booking.find({
      owner: _id,
      status: "pending",
    });

    const confirmedBookings = await Booking.find({
      owner: _id,
      status: "confirmed",
    });

    const monthlyRevenue = confirmedBookings.reduce(
      (acc, booking) => acc + booking.price,
      0
    );

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: confirmedBookings.length,
      recentBookings: bookings.slice(0, 5),
      monthlyRevenue,
    };

    return res.status(200).json({ success: true, dashboardData });
  } catch (error: unknown) {
    console.error(error);

    const errorMessage =
      error instanceof Error ? error.message : "Server error";

    return res
      .status(500)
      .json({ success: false, message: errorMessage });
  }
}

export default protect(handler);
