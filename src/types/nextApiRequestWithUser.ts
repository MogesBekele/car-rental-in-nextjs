// types/NextApiRequestWithUser.ts
import { NextApiRequest } from 'next';

export interface UserType {
  _id: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
}

export interface NextApiRequestWithUser extends NextApiRequest {
  user?: UserType;
}
