import multer from "multer";

// Use memory storage for easier usage with Next.js API routes
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
