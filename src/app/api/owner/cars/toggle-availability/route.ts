// /api/owner/cars/toggle-availability/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  await connectDB();

  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { carId } = await req.json();
    const car = await Car.findById(carId);

    if (!car || car.owner.toString() !== user._id.toString()) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    return NextResponse.json({
      success: true,
      message: "Car availability toggled successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'error' }, { status: 500 });
  }
}
