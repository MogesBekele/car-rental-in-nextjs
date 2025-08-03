// src/lib/auth.ts
import { NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from './db';
import { NextApiRequestWithUser } from '@/types/nextApiRequestWithUser';

type Handler = (req: NextApiRequestWithUser, res: NextApiResponse) => Promise<void>;

export const protect = (handler: Handler) => {
  return async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token missing or malformed',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      await connectDB();

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      req.user = user;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  };
};
