import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import validator from "validator";
import User from "@/models/User";
import connectDB from "@/lib/db";
import { createToken } from "@/utils/jwt";

export async function POST(req: NextRequest) {
  await connectDB();

  const { name, email, password } = await req.json();

  if (!validator.isEmail(email)) {
    return NextResponse.json(
      { success: false, message: "Invalid email" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { success: false, message: "Password too short" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { success: false, message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = createToken(user._id.toString());
  return NextResponse.json({ success: true, token });
}
