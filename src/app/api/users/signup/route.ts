import { ensureDbConnect } from "@/app/db/dbConnect";
import { User } from "@/app/db/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  await ensureDbConnect();
  const inputs = await req.json();
  const { email, password, gender, imageUrl } = inputs;
  // const secret = process.env.SECRET;
  try {
    const user = await User.find({ email });
    if (user.length > 0) {
      return Response.json({ success: false, msg: "user already exists! Do Login!", user });
    }
    let newUser = new User({ email, password, gender, imageUrl });
    await newUser.save();
    newUser = JSON.stringify(newUser);
    const token = await jwt.sign(newUser, "secret123");

    // Set the token in a cookie
    cookies().set({
      name: 'token',
      value: token,
      httpOnly: true,
      maxAge: 604800
    })
    return Response.json({ success: true, newUser, token });
  }
  catch {
    return Response.json({ success: false, msg: "Error - catch block" });
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     // Access request data
//     let body = await req.json();

//     return Response.json({ msg: "Success!" }); // Or appropriate status code and message
//   } catch (error) {
//     console.error(error);
//     return Response.json({ msg: "Internal Server Error" }); // Handle errors gracefully
//   }
// }
