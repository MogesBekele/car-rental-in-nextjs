import mongoose, { Schema, models, model, Types } from "mongoose";

export interface ICar {
  owner: Types.ObjectId;
  brand: string;
  model: string;
  image: string;
  year: number;
  category: string;
  seating_capacity: number;
  fuel_type: string;
  transmission: string;
  pricePerDay: number;
  location: string;
  description: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const carSchema = new Schema<ICar>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    image: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    seating_capacity: { type: Number, required: true },
    fuel_type: { type: String, required: true },
    transmission: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// HMR-safe model export for Next.js
const Car = models.Car || model<ICar>("Car", carSchema);

export default Car;
