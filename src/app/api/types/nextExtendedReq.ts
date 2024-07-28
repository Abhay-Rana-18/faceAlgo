// types/next.d.ts

import { NextApiRequest } from 'next';
import {IUser} from "@/app/db/user";
import { NextRequest } from 'next/server';

export interface NextApiRequestWithUser extends NextRequest {
  user?: IUser | null;
}
