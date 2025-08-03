import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import fs from "fs";
import path from "path";
import Car from "@/models/Car";
import connectDB from "@/lib/db";
import { protect } from "@/lib/auth";

// Extend NextApiRequest to include multer file & user from auth
interface NextApiRequestWithFile extends NextApiRequest {
  file?: Express.Multer.File;
  user?: any;  // Use your User type here if you have it
}

const uploadDir = path.join(process.cwd(), "uploads/cars");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

const handler = nextConnect<NextApiRequestWithFile, NextApiResponse>({
  onError(error, req, res) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  },
  onNoMatch(req, res) {
    res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  },
});

handler.use(protect);
handler.use(upload.single("image"));

handler.post(async (req: NextApiRequestWithFile, res: NextApiResponse) => {
  try {
    await connectDB();

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is missing" });
    }

    const carData = JSON.parse(req.body.carData);

    const imagePath = `/uploads/cars/${req.file.filename}`;

    await Car.create({
      ...carData,
      owner: req.user._id,
      image: imagePath,
    });

    res.status(200).json({ success: true, message: "Car added successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
});

export const config = {
  api: { bodyParser: false },
};

export default handler;
