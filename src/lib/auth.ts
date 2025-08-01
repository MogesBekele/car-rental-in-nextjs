// lib/auth.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).select("-password");
    return user || null;
  } catch {
    return null;
  }
}
