// utils/protect.ts

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '@/app/db/user';
import { NextApiRequestWithUser } from '../types/nextExtendedReq';


interface DecodedToken {
  id: string;
}

const protect = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse
  // next: () => any
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // Decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      console.log(decoded);
      req.user = await User.findById(decoded.id);

      // next();
    } catch (error) {
      return Response.json({ message: 'Not authorized, token failed' });
    }
  } else {
    return Response.json({ message: 'Not authorized, no token' });
  }
};

export default protect;
