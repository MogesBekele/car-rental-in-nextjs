// lib/auth.ts

import type { NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function getUserFromRequest(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
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
