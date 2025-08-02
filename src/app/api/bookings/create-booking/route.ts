import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Car from "@/models/Car";
import { getUserFromRequest } from "@/lib/auth"; // see below for auth helper

async function checkAvailability(car: string, pickupDate: string, returnDate: string) {
  const bookings = await Booking.find({
    car,
    $or: [{ pickupDate: { $lt: new Date(returnDate) }, returnDate: { $gt: new Date(pickupDate) } }],
  });
  return bookings.length === 0;
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { car, pickupDate, returnDate } = await req.json();

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return NextResponse.json({ success: false, message: "Car is not available" }, { status: 400 });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return NextResponse.json({ success: false, message: "Car not found" }, { status: 404 });
    }

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned.getTime() - picked.getTime()) / (1000 * 60 * 60 * 24));
    const price = noOfDays * carData.pricePerDay;

    await Booking.create({
      car,
      owner: carData.owner,
      user: user._id,
      pickupDate,
      returnDate,
      price,
    });

    return NextResponse.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 500 });
  }
}
