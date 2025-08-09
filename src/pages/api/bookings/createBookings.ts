import type { NextApiResponse } from "next";
import type { NextApiRequestWithUser } from "@/types/nextApiRequestWithUser";
import connectDB from "@/lib/db";
import { protect } from "@/lib/auth";
import Booking from "@/models/Booking";
import Car from "@/models/Car";
import { checkAvailability } from "@/lib/checkAvailability"; // Assuming you have a function to check car availability

const createBookings = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse
) => {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
    }

    await connectDB();

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    if (!car || !pickupDate || !returnDate) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);

    if (!isAvailable) {
      return res.status(200).json({
        success: true,
        message: "Car is already booked for these dates",
        alreadyBooked: true, // optional flag to indicate booking conflict
      });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil(
      (returned.getTime() - picked.getTime()) / (1000 * 60 * 60 * 24)
    );
    const price = noOfDays * carData.pricePerDay;

    await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
    });

    res
      .status(201)
      .json({ success: true, message: "Booking created successfully" });
  } catch (error: unknown) {
    console.error("Booking creation error:", error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

// Wrap with auth middleware
export default protect(createBookings);
