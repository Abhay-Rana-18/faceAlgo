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
  const response = NextResponse.next();
  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  return response;
};

export const config = {
  matcher: ['/profile/:path*', '/chat/:path*'],
}
export default middleware;