import type { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { NextApiRequestWithUser } from '@/types/nextApiRequestWithUser'; // updated type here
import multer from '@/lib/multer';
import { protect } from '@/lib/auth';
import Car from '@/models/Car';
import connectDB from '@/lib/db';
import fs from 'fs';
import path from 'path';

interface ApiResponse {
  success: boolean;
  message: string;
  car?: unknown;
}

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse<ApiResponse>>({
  onError: (err, req, res) => {
    console.error('API Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, message });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  },
});

handler.use(multer.single('image'));

handler.post(
  protect(async (req, res) => {
    await connectDB();

    const imageFile = req.file;
    const user = req.user;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: 'Image file is missing' });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: user missing' });
    }

    const carData = JSON.parse(req.body.carData);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const destinationPath = path.join(uploadsDir, imageFile.originalname);
    fs.writeFileSync(destinationPath, fs.readFileSync(imageFile.path));

    const imageUrl = `/uploads/${imageFile.originalname}`;

    const newCar = await Car.create({
      ...carData,
      image: imageUrl,
      owner: user._id,
    });

    res.status(200).json({
      success: true,
      message: 'Car added successfully',
      car: newCar,
    });
  })
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
