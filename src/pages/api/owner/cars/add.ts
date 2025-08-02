// pages/api/owner/cars/add.ts

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import formidable from "formidable";
import { getUserFromRequest } from "@/lib/auth"; // make sure this accepts NextApiRequest
import Car from "@/models/Car";
import connectDB from "@/lib/db";

export const config = {
  api: {
    bodyParser: false, // disable default body parser for file uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  await connectDB();

  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      res.status(400).json({ success: false, message: "Form parsing failed" });
      return;
    }

    try {
      const rawCarData = Array.isArray(fields.carData) ? fields.carData[0] : fields.carData;
      const carData = typeof rawCarData === "string" ? JSON.parse(rawCarData) : {};

      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

      if (!imageFile) {
        res.status(400).json({ success: false, message: "Image file missing" });
        return;
      }

      // Ensure uploads directory exists
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      // Save file with a unique name
      const ext = path.extname(imageFile.originalFilename || ".jpg");
      const fileName = `${Date.now()}${ext}`;
      const newPath = path.join(uploadsDir, fileName);

      const imageData = fs.readFileSync(imageFile.filepath);
      await writeFile(newPath, imageData);

      const imageURL = `/uploads/${fileName}`;

      await Car.create({
        ...carData,
        owner: user._id,
        image: imageURL,
      });

      res.status(200).json({ success: true, message: "Car added successfully" });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
}
