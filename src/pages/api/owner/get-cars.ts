// src/pages/api/owner/get-cars.ts
import type { NextApiResponse } from "next";
import type { NextApiRequestWithUser } from "@/types/nextApiRequestWithUser";
import Car from "@/models/Car";
import { protect } from "@/lib/auth";

interface ApiResponse {
  success: boolean;
  cars?: unknown[];
  message?: string;
}
// The actual handler logic (only runs if auth passes)
const handler = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse<ApiResponse>
) => {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }
  try {
    const ownerId = req.user?._id;
    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: ownerId });

    res.status(200).json({ success: true, cars });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Export the protected handler
export default protect(handler);
