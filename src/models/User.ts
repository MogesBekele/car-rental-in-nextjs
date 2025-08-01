import mongoose, { Schema, Document, models } from "mongoose";

// Optional: Add TypeScript type for User
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "owner";
  image?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "owner"], default: "user" },
    image: { type: String, default: "" },
  },
  { minimize: false, timestamps: true }
);

// Prevent model overwrite in Next.js (due to HMR in dev)
const User = models.User || mongoose.model<IUser>("User", userSchema);

export default User;
