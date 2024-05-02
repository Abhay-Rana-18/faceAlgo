import { ensureDbConnect } from "@/app/db/dbConnect";
import { User } from "@/app/db/user";
import { redirect } from "next/dist/server/api-utils";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    await ensureDbConnect();
    const inputs = await req.json();
    const { email, password } = inputs;
    try {
        let user = await User.find({ email, password });
        if (user.length > 0) {
            user = JSON.stringify(user);
            const token = await jwt.sign(user, "secret123");

            // Set the token in a cookie
            cookies().set({
                name: 'token',
                value: token,
                httpOnly: true,
                maxAge: 604800
            })
            return Response.json({ success: true, user, token });
        }
        else {
            return Response.json({ success: false, msg: "wrong email/passoword" });
        }

    }
    catch (e) {
        return Response.json({ success: false, msg: "Error - catch block", errror: e });
    }
}