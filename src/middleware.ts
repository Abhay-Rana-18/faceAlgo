import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { User } from '@/app/db/user';
import { NextApiRequestWithUser } from './app/api/types/nextExtendedReq';
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

interface DecodedToken {
  id: string;
}

const middleware = async (req: NextApiRequestWithUser) => {
  let token = cookies().get("token")?.value;
  console.log("cookie middleware: " + token);
  if (!token) {
    return new NextResponse(JSON.stringify({ message: 'No token found!' }), { status: 401 });
  }
  return NextResponse.next();
};

export const config = {
  matcher: ['/profile/:path*', '/chat/:path*'],
}
export default middleware;