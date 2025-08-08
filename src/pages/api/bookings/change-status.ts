// src/pages/api/bookings/change-status.ts
import type { NextApiResponse } from "next";
import type { NextApiRequestWithUser } from "@/types/nextApiRequestWithUser";
import Booking from "@/models/Booking";
import connectDB from "@/lib/db";
import { protect } from "@/lib/auth";

const changeBookingStatus = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse
) => {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { _id } = req.user;
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.owner.toString() !== _id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking status changed successfully",
    });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'server error' });
  }
};

export default protect(changeBookingStatus);
