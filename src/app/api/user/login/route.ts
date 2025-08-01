import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/lib/db";
import { createToken } from "@/utils/jwt";

export async function POST(req: NextRequest) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 400 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 400 }
    );
  }

  const token = createToken(user._id.toString());
  return NextResponse.json({ success: true, token });
}
