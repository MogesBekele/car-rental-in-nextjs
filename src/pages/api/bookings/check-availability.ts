import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { location, pickupDate, returnDate } = req.body;

  try {
    await connectDB();

    // Example query: Find bookings that overlap with requested dates and location
    const bookings = await Booking.find({
      location,
      $or: [
        { pickupDate: { $lt: new Date(returnDate) }, returnDate: { $gt: new Date(pickupDate) } }
      ]
    }).populate("car");

    // Process availability logic here...
    // Example: filter available cars, or whatever your logic is

    res.status(200).json({ success: true, AvailableCars: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}
