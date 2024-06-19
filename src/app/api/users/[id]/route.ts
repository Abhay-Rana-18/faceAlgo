import { ensureDbConnect } from "@/app/db/dbConnect";
import { User } from "@/app/db/user";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest,  { params }: { params: { id: string } }) {
    await ensureDbConnect();
    const id = params.id;
    const userId = new mongoose.Types.ObjectId(id); // Convert to ObjectId
    try {
        const user = await User.findById(userId);
        if (user) {
            return Response.json({ success: true, user });
        }
        else {
            return Response.json({ success: false, msg: "wrong user id" });
        }
    }

    catch (e) {
        console.log(e);
        return Response.json({ success: false, msg: "Error - catch block", errror: e });
    }
}