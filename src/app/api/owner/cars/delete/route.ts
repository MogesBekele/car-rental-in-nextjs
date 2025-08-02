
// app/api/owner/cars/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { getUserFromRequest } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { carId } = await req.json();

    const car = await Car.findById(carId);
    if (!car) {
      return NextResponse.json(
        { success: false, message: "Car not found" },
        { status: 404 }
      );
    }

    if (car.owner.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Mark the car as removed
    car.owner = null;
    car.isAvailable = false; // your original code had `available` but your schema uses `isAvailable`
    await car.save();

    return NextResponse.json({ success: true, message: "Car removed" });
  } catch (error){
    console.error(error);
    return NextResponse.json(
      { success: false, message: ' error' },
      { status: 500 }
    );
  }
}
