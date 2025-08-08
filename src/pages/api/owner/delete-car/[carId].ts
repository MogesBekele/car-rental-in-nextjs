import type { NextApiResponse } from "next";
import type { NextApiRequestWithUser } from "@/types/nextApiRequestWithUser";
import { protect } from "@/lib/auth";
import Car from "@/models/Car";

interface ApiResponse {
  success: boolean;
  message: string;
}

const handler = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse<ApiResponse>
) => {
  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  // Defensive check
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const userId = req.user._id.toString();

  const { carId } = req.query;
  if (typeof carId !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid carId parameter" });
  }

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // Check ownership
    if (!car.owner || car.owner.toString() !== userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Soft delete: unassign ownership and mark unavailable
    car.owner = null;
    car.isAvailable = false;

    await car.save();

    return res.status(200).json({ success: true, message: "Car removed" });
  } catch (error) {
    console.error("Error deleting car:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default protect(handler);
