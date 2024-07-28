import { ensureDbConnect } from "@/app/db/dbConnect";
import { Chat } from "@/app/db/chat";
import { NextApiRequestWithUser } from "../../types/nextExtendedReq";
import { NextApiResponse } from "next";
import { User } from "@/app/db/user";
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";
import { useRouter } from "next/router";
import { cookies } from "next/headers";

interface DecodedToken {
    id: string,
    email: string
};

export async function GET(req: NextApiRequestWithUser, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        console.log("id: " + id);
        const secretKey = "secret123";
        let userId;
        let token = cookies().get("token")?.value;
        if (token) {
            try {
                const decoded = jwt.verify(token, secretKey);
                userId = decoded?.id;
                console.log("userid: " + userId);
            } catch (error) {
                console.error("Invalid or expired token", error);
            }
        } else {
            console.log("No token found");
            // Handle case where there's no token (e.g., redirect to login)
        }
        // const userId = ;
        console.log("logged in user: " + userId);
        await ensureDbConnect();

        var isChat = await Chat.find({
            $and: [
                { users: { $elemMatch: { $eq: id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        }).populate("users");
        console.log("chat: " + isChat);
        try {
            if (isChat.length > 0) {
                return Response.json({ success: true, chat: isChat[0] });
            }
            // const user = await User.findById(userId);
            // console.log("logged in user: "+user);
            const user1 = await User.findById(id);
            // console.log("selected user: "+user1);
            let chat = await Chat.create({
                chatName: user1?.email,
                users: [userId, id]
            });
            chat = chat.populate("users");
            return Response.json({ success: true, chat: chat });
        }
        catch (e) {
            console.log(e);
            return Response.json({ success: false, msg: "Error - catch block", errror: e });
        }
    } catch (error) {
        return Response.json({ message: 'Not authorized, token failed' });
    }
};

// export async function GET() {
//     try {
//         const chats = await Chat.find();
//         return Response.json({ "success": true, chats });
//     } catch (e) {
//         return Response.json({ "success": false });
//     }
// };