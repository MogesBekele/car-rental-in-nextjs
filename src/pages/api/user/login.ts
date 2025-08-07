// src/pages/api/user/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/User';            // Adjust your import paths as necessary
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/jwt';   // Your JWT token creation helper

const loginUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user?.password) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    const token = createToken(user._id.toString());

    return res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default loginUser;
