import { NextApiRequest } from 'next';

export interface UserType {
  _id: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
}

// Add multer's File type
export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

export interface NextApiRequestWithUser extends NextApiRequest {
  user?: UserType;
  file?: MulterFile;
}
