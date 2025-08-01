// app/api/user/cars/route.ts
import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import Car from "@/models/Car";

export const GET = async (req: NextRequest) => {
  await connectDB();

  const auth = await getUserFromRequest(req);
  if ("user" in auth) {
    const { user } = auth;

    try {
      const cars = await Car.find({ owner: user._id });
      return Response.json({ success: true, cars });
    } catch (error) {
      console.error("Failed to fetch user cars:", error);
      return Response.json(
        { success: false, message: "Failed to load your cars" },
        { status: 500 }
      );
    }
  }

  return auth; // token error response (401 or 404)
};
