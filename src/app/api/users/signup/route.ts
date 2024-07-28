import { ensureDbConnect } from "@/app/db/dbConnect";
import { User } from "@/app/db/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';
import {v2 as cloudinary} from "cloudinary"

 // Configuration
 cloudinary.config({ 
  cloud_name: 'dwlezv6pr', 
  api_key: '852377643891357', 
  api_secret: 'gppmhtXVGd8h_r8lhJyFrbeLcQE' 
});

export async function POST(req: NextRequest) {
  await ensureDbConnect();
  const inputs = await req.json();
  const { name, email, password, gender, imageUrl, age, status, description } = inputs;
  // const secret = process.env.SECRET;
  try {
    const user = await User.find({ email });
    if (user.length > 0) {
      return Response.json({ success: false, msg: "user already exists! Do Login!", user });
    }

    const result = await cloudinary.uploader.upload(imageUrl,{
      folder:"profile",
    })
    const image = result.secure_url;
    console.log("image url: "+image);

    let newUser = new User({ name:name, email:email, password:password, gender:gender, imageUrl:image, age:age, status:status, description:description });
    await newUser.save();
    const payload = {
      id: newUser._id,
      email: newUser.email
    };
    const token = jwt.sign(payload, "secret123", {expiresIn: '2000h'});

    // Set the token in a cookie
    cookies().set({
      name: 'token',
      value: token,
      httpOnly: true,
      maxAge: 604800
    })
    return Response.json({ success: true, newUser, token });
  }
  catch(e) {
    return Response.json({ success: false, msg: e });
  }
}

