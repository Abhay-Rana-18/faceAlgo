import { Message } from "@/app/db/message";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const {id} = params;
        if (!id) {
            return NextResponse.json({ success: false, message: "No id found!" });
        }
        const messages = await Message.find({chat: id});
        if (!messages) {
            return NextResponse.json({ success: false, message: "No messages found!" });
        }
        return NextResponse.json({success: true, message: "All messages of this chat is fetched successfully!", msg: messages});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Internal Server error!" });
    }
}