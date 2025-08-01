import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import { protect } from "@/lib/middleware/auth";

export const GET = async (req: NextRequest) => {
  await connectDB();

  const auth = await protect(req);
  if ("user" in auth) {
    return Response.json({ success: true, user: auth.user });
  }

  return auth; // this will return 401 if not authorized
};
