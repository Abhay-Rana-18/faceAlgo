import { ensureDbConnect } from "@/app/db/dbConnect";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server"
import jwt from 'jsonwebtoken';
import { User } from "@/app/db/user";
import { NextApiRequest } from "next";
import { Message } from "@/app/db/message";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { userId, content, chatId, time } = body;
        console.log("body: "+body.content);
        await ensureDbConnect();
        let msg = await Message.create({ chat: chatId, sender: userId, content: content, time: time });
        msg = await msg.populate("chat");
        return NextResponse.json({ success: true, message: 'Message posted successfully', msg: msg });
    } catch (e) {
        return NextResponse.json({ success: false, message: "Internal Server error!" });
    }
}

