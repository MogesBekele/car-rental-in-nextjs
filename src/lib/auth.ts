// src/lib/auth.ts
import jwt from "jsonwebtoken";
import User from "@/models/User";
import type { NextApiRequest } from "next";

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export async function getUserFromRequest(req: NextApiRequest) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "id" in decoded &&
      typeof (decoded as JwtPayload).id === "string"
    ) {
      const userId = (decoded as JwtPayload).id;
      const user = await User.findById(userId).select("-password");
      return user || null;
    }

    return null;
  } catch (err) {
    console.error("JWT Error:", err);
    return null;
  }
}
