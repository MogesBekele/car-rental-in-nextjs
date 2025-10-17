import mongoose, { Document, Schema, Types, models, model } from "mongoose";

export interface IBooking extends Document {
  car: Types.ObjectId;
  user: Types.ObjectId;
  owner: Types.ObjectId;
  pickupDate: Date;
  returnDate: Date;
  status: "pending" | "confirmed" | "cancelled";
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    car: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
//  Prevent model overwrite in dev (Next.js HMR)
const Booking = models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
