import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import fs from 'fs';
import path from 'path';
import multer from '@/lib/multer'; // adjust path if needed

// Extend NextApiRequest with optional multer file
interface ExtendedRequest extends NextApiRequest {
  file?: Express.Multer.File;
}

// Response shape interface
interface ApiResponse {
  success: boolean;
  message: string;
  car?: unknown;
}

// Create handler with error and no-match handlers
const handler = nextConnect<ExtendedRequest, NextApiResponse<ApiResponse>>({
  onError: (err, req, res) => {
    console.error('API Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, message });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  },
});

// Use multer middleware to handle single file upload named 'image'
handler.use(multer.single('image'));

// POST endpoint logic
handler.post(async (req, res) => {
  try {
    const imageFile = req.file;
    const carData = JSON.parse(req.body.carData);

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: 'Image file is missing',
      });
    }

    // Define uploads directory path inside /public
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Move file from temp location to uploads folder
    const destinationPath = path.join(uploadsDir, imageFile.originalname);
    fs.writeFileSync(destinationPath, fs.readFileSync(imageFile.path));

    // Construct URL to serve image
    const imageUrl = `/uploads/${imageFile.originalname}`;

    // Send success response with car data including image URL
    res.status(200).json({
      success: true,
      message: 'Car added successfully',
      car: {
        ...carData,
        imageUrl,
      },
    });
  } catch (error: unknown) {
    console.error('Error in POST /api/owner/add-car:', error);
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(500).json({
      success: false,
      message,
    });
  }
});

// Disable Next.js default body parsing to allow multer to work
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
