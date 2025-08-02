import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export const PATCH = async (req: NextRequest) => {
  await connectDB();

  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await User.findByIdAndUpdate(user._id, { role: "owner" });

    return NextResponse.json({
      success: true,
      message: "Now you can control the dashboard",
    });
  } catch (error) {
    console.error("Error changing role:", error);
    return NextResponse.json(
      { success: false, message: 'Error changing role' },
      { status: 500 }
    );
  }
};
