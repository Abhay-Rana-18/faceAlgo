import { NextApiResponse } from "next";
import { NextApiRequestWithUser } from "../../types/nextExtendedReq";
import protect from "../../middleware/authMiddleware";
import jwt from 'jsonwebtoken';
import { User } from '@/app/db/user';
import { ensureDbConnect } from "@/app/db/dbConnect";
import { cookies } from "next/headers";

interface DecodedToken {
  id: string;
}

// Handler function to get user
export const getUser = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  console.log("Getting user details --->");
  const secretKey = "secret123";
  let email;
  let token = cookies().get("token")?.value;
  console.log("detail -> token: " + token);
  if (token) {
    try {
      const decoded = jwt.verify(token, secretKey);
      email = decoded?.email;
      console.log("Emai: " + email);
    } catch (error) {
      console.error("Invalid or expired token", error);
    }
  } else {
    console.log("No token found");
  }
  return Response.json({ success: true, message: "User details fetched successfully!", email: email })


};

// API route using GET method
export async function GET(req: NextApiRequestWithUser, res: NextApiResponse) {
  let token = cookies().get("token")?.value;
  if (
    token
  ) {
    try {
      // Decodes token id
      console.log("getting user details with the token: "+token);
      let decoded = jwt.verify(token, "secret123");
      await ensureDbConnect();
      const user = await User.findById(decoded?.id);
      console.log("user deatails: ", user);
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

// console.log("details");
// const res2 = await protectMiddleware(req, res, getUser);
// return res2;