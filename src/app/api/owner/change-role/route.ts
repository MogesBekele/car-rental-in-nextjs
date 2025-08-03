// pages/api/owner/change-role.ts
import { NextApiResponse } from "next";
import { protect } from "@/lib/auth";
import User from "@/models/User";
import connectDB from "@/lib/db";
import { NextApiRequestWithUser } from "@/types/nextApiRequestWithUser";

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectDB();

    const userId = req.user?._id; // ✅ safe optional chaining

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await User.findByIdAndUpdate(userId, { role: "owner" });

    return res.json({ success: true, message: "Now you can control the dashboard" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

export default protect(handler);
