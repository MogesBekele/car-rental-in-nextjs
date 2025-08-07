// src/pages/api/owner/delete-car.ts

import type { NextApiResponse } from 'next';
import type { NextApiRequestWithUser } from '@/types/nextApiRequestWithUser';
import { protect } from '@/lib/auth';
import Car from '@/models/Car';

interface ApiResponse {
  success: boolean;
  message: string;
}

// Main handler logic
const handler = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse<ApiResponse>
) => {
  if (req.method !== 'DELETE') {
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { _id } = req.user!;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    if (car.owner.toString() !== _id.toString()) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Soft delete: unassign ownership and mark unavailable
    car.owner = null;
    car.isAvailable = false;

    await car.save();

    res.status(200).json({ success: true, message: 'Car removed' });
  } catch (error: unknown) {
    console.error('Error deleting car:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Wrap handler with your JWT auth middleware
export default protect(handler);
