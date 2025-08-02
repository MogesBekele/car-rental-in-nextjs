import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { getUserFromRequest } from "@/lib/auth"; // See note below

export const config = {
  api: {
    bodyParser: false, // Disable default Next.js body parser to handle file upload
  },
};

// Helper function to parse form with formidable
const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable({ keepExtensions: true, multiples: true, uploadDir: "/tmp" });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  await connectDB();

  // Get authenticated user from request
  const user = await getUserFromRequest(req); // <-- See note about this below
  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const { fields, files } = await parseForm(req);

    // Parse car data safely
    const rawCarData = Array.isArray(fields.carData) ? fields.carData[0] : fields.carData;
    const carData = typeof rawCarData === "string" ? JSON.parse(rawCarData) : {};

    // Get image file (support single or multiple files)
    const imageFiles = Array.isArray(files.image) ? files.image : [files.image];
    const imageFile = imageFiles[0] as File;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Image file missing" });
    }

    // Prepare upload directory inside /public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate a unique filename for the uploaded image
    const ext = path.extname(imageFile.originalFilename || ".jpg");
    const fileName = `${Date.now()}${ext}`;
    const newPath = path.join(uploadsDir, fileName);

    // Read file data and write to new location
    const imageData = fs.readFileSync(imageFile.filepath);
    await writeFile(newPath, imageData);

    // Construct image URL accessible from frontend
    const imageURL = `/uploads/${fileName}`;

    // Save car to DB with owner and image URL
    await Car.create({
      ...carData,
      owner: user._id,
      image: imageURL,
    });

    return res.status(200).json({ success: true, message: "Car added successfully" });
  } catch (error) {
    console.error("Error in adding car:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
