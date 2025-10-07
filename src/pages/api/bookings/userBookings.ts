import type { NextApiResponse } from "next";
import type { NextApiRequestWithUser } from "@/types/nextApiRequestWithUser";
import Booking from "@/models/Booking";
import connectDB from "@/lib/db";
import { protect } from "@/lib/auth";

 const getUserBookings = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
  try {
    await connectDB();
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error: unknown) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
    });
  }
};
export default protect(getUserBookings);