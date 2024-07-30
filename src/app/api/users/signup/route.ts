import { ensureDbConnect } from "@/app/db/dbConnect";
import { User } from "@/app/db/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';
import { v2 as cloudinary } from "cloudinary"

// Configuration
cloudinary.config({
  cloud_name: 'dwlezv6pr',
  api_key: '852377643891357',
  api_secret: 'gppmhtXVGd8h_r8lhJyFrbeLcQE'
});

export async function POST(req: NextRequest) {
  try {
    // Ensure the database connection is established
    await ensureDbConnect();

    // Parse request body
    const inputs = await req.json();
    const { name, email, password, gender, imageUrl, age, status, description } = inputs;

    // Check if user already exists
    const user = await User.find({ email });
    if (user.length > 0) {
      return NextResponse.json({ success: false, msg: "User already exists! Do Login!", user });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "profile",
    });

    // Get the image URL from Cloudinary
    const image = result.secure_url;
    console.log("Image URL: " + image);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password,
      gender,
      imageUrl: image,
      age,
      status,
      description
    });
    await newUser.save();

    // Create a JWT token
    const payload = {
      id: newUser._id,
      email: newUser.email
    };
    const token = jwt.sign(payload, "secret123", { expiresIn: '2000h' });

    // Set the token in a cookie
    const res = NextResponse.json({ success: true, newUser, token });
    cookies().set({
      name: 'token',
      value: token,
      httpOnly: true,
      maxAge: 604800
    })

    // Set headers
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return res;
  } catch (e:any) {
    console.error(e); // Log error for debugging
    return NextResponse.json({ success: false, msg: e.message || 'An error occurred' });
  }
}

