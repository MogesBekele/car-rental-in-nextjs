import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "owner") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const bookings = await Booking.find({ owner: user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: ' unauthorized' }, { status: 500 });
  }
}
