import { NextApiResponse } from "next";
import { NextApiRequestWithUser } from "../../types/nextExtendedReq";
import jwt from 'jsonwebtoken';
import { User } from '@/app/db/user';
import { ensureDbConnect } from "@/app/db/dbConnect";
import { cookies } from "next/headers";

interface DecodedToken {
  id: string;
}

// API route using GET method
export async function GET(req: NextApiRequestWithUser, res: NextApiResponse) {
  let token = cookies().get("token")?.value;
  if (
    token
  ) {
    try {
      // Decodes token id
      let decoded = jwt.verify(token, "secret123") as DecodedToken;
      await ensureDbConnect();
      const user = await User.findById(decoded?.id);
      return Response.json({ success: true, message: "user fetched successfully!", user: user });

    } catch (error) {
      console.log("error");
      return Response.json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    console.log("no auth");
    return Response.json({ success: false, message: 'Not authorized, no token' });
  }
}

