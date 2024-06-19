// types/next.d.ts

import { NextApiRequest } from 'next';
import {IUser} from "@/app/db/user";

export interface NextApiRequestWithUser extends NextApiRequest {
  user?: IUser | null;
}
