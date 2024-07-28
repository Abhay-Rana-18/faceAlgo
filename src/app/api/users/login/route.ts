import { ensureDbConnect } from "@/app/db/dbConnect";
import { User } from "@/app/db/user";
import { redirect } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';

export async function POST(req: NextRequest): Promise<NextResponse> {
    await ensureDbConnect();
    const inputs = await req.json();
    const { email, password } = inputs;

    try {
        const user = await User.findOne({ email, password }).lean(); // Use lean() to get plain JavaScript objects

        if (user) {
            const payload = {
                id: user._id,
                email: user.email
            };

            const token = jwt.sign(payload, "secret123", { expiresIn: '2000h' });
            console.log(token);

            // Set the token in a cookie
            cookies().set({
                name: 'token',
                value: token,
                httpOnly: true,
                maxAge: 604800
            });

            return NextResponse.json({ success: true, user, token });
        } else {
            return NextResponse.json({ success: false, msg: "wrong email/password" });
        }

    } catch (e: any) {
        return NextResponse.json({ success: false, msg: "Error - catch block", error: e.message });
    }
}
