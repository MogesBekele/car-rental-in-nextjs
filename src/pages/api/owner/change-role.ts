import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    await connectDB();
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token); // must return userId or similar

    await User.findByIdAndUpdate(decoded.userId, { role: "owner" });

    return res.status(200).json({ success: true, message: "Role updated" });
  } catch (error) {
    console.error("Change role error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
