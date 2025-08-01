import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { bookingId, status } = await req.json();

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    if (booking.owner.toString() !== user._id.toString()) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    booking.status = status;
    await booking.save();

    return NextResponse.json({ success: true, message: "Booking status changed successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'error' }, { status: 500 });
  }
}
