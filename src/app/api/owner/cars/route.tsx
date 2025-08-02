import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { getUserFromRequest } from "@/lib/auth";

export const GET = async (req: NextRequest) => {
  await connectDB();

  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const cars = await Car.find({ owner: user._id });
    return NextResponse.json({ success: true, cars });
  } catch (error) {
    console.error("Error fetching owner's cars:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to load your cars' },
      { status: 500 }
    );
  }
};
