// lib/middleware/auth.ts
import jwt from "jsonwebtoken";
import User from "@/models/User"; // adjust the path if needed
import { NextRequest, NextResponse } from "next/server";

export const protect = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "Not authorized, token missing or malformed" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as { id: string };

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return { user }; // return user so route handler can use it
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
};
