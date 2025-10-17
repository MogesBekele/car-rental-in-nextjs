import nextConnect from "next-connect";
import upload from "@/lib/multer"; // your multer config file
import User from "@/models/User";
import connectDB from "@/lib/db";
import { protect } from "@/lib/auth";
import type { NextApiResponse } from "next";
import type { NextApiRequestWithUser } from "@/types/nextApiRequestWithUser";

const handler = nextConnect<NextApiRequestWithUser, NextApiResponse>({
  onError(error, req, res) {
    res.status(500).json({ success: false, message: error.message });
  },
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} not allowed` });
  },
});

// Use multer middleware, field name is 'image'
handler.use(upload.single("image"));
handler.post(async (req, res) => {
  try {
    await connectDB();

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { _id } = req.user;
    const imageFile = req.file;

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is missing" });
    }

    // imageFile.path is the full temp file path
    // You can move it or just store the filename for later processing

    // For example, store the filename or path relative to your storage setup
    const imagePath = `/uploads/${imageFile.filename}`; // adjust based on how you serve files

    await User.findByIdAndUpdate(_id, { image: imagePath });

    res.json({
      success: true,
      message: "Image updated successfully",
      image: imagePath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
export const config = {
  api: {
    bodyParser: false,
  },
};

export default protect(handler);
