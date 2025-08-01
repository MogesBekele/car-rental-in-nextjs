import jwt from "jsonwebtoken";

export const createToken = (id: string) => {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign({ id }, secret, { expiresIn: "7d" });
};
