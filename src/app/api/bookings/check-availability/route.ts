import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Car from "@/models/Car";

async function checkAvailability(car: string, pickupDate: string, returnDate: string) {
  const bookings = await Booking.find({
    car,
    $or: [{ pickupDate: { $lt: new Date(returnDate) }, returnDate: { $gt: new Date(pickupDate) } }],
  });
  return bookings.length === 0;
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const { location, pickupDate, returnDate } = await req.json();

    // Find cars matching location and availability
    const cars = await Car.find({ location, isAvailable: true });

    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkAvailability(car._id.toString(), pickupDate, returnDate);
      return { ...car.toObject(), isAvailable };
    });

    let availableCars = await Promise.all(availableCarsPromises);
    availableCars = availableCars.filter((car) => car.isAvailable);

    return NextResponse.json({ success: true, AvailableCars: availableCars });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to check availability" },
      { status: 500 }
    );
  }
}
