// src/pages/api/owner/bookings.ts
import type { NextApiResponse } from "next";
import type { NextApiRequestWithUser } from "@/types/nextApiRequestWithUser";
import Booking from "@/models/Booking";
import connectDB from "@/lib/db";
import { protect } from "@/lib/auth";

const getOwnerBookings = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse
) => {
  await connectDB();

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Check if user exists and is owner
    if (!req.user || req.user.role !== "owner") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, bookings });
  } catch (error: unknown) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};

// Protect the route with middleware
export default protect(getOwnerBookings);
