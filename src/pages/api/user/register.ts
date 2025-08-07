// src/pages/api/user/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/User';              // Adjust import paths as needed
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { createToken } from '@/lib/jwt';     // Your JWT token creation helper

const registerUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Please enter a strong password' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = createToken(user._id.toString());
    return res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default registerUser;
