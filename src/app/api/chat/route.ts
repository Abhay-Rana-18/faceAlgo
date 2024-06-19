import { ensureDbConnect } from "@/app/db/dbConnect";
import { Chat } from "@/app/db/chat";
import { NextApiRequestWithUser } from "../types/nextExtendedReq";
import { NextApiResponse } from "next";
import protect from "../middleware/authMiddleware";
import { User } from "@/app/db/user";
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";

const handler2 = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    console.log("second");
    await ensureDbConnect();
    const userId = req.body;
    var isChat = await Chat.find({
        $and: [
            { users: { $elemMatch: { $eq: req.user?._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");
    try {
        if (isChat) {
            return Response.json({ success: true, isChat });
        }
        const user = await User.findById(userId);
        const chat = await Chat.create({
            chatName: user?.email,
            users: [userId, req.user?._id]
        });
        return Response.json({ success: true, chat });
    }
    catch (e) {
        console.log(e);
        return Response.json({ success: false, msg: "Error - catch block", errror: e });
    }
}

interface DecodedToken {
    id: string,
    email: string
};

export async function POST(req: NextApiRequestWithUser, res: NextApiResponse) {
    const authorization = req.headers.get('authorization');
    let token: string | undefined;

    if (
        authorization &&
        authorization.startsWith('Bearer')
    ) {
        try {
            token = authorization.split(' ')[1];
            // Decodes token id
            const decoded = jwt.verify(token, "secret123");
            req.user = await User.findById(decoded.id);
            await ensureDbConnect();
            const body = await req.json();
            const userId = body.id;
            // var isChat = await Chat.find({
            //     $and: [
            //         { users: { $elemMatch: { $eq: req.user?._id } } },
            //         { users: { $elemMatch: { $eq: userId } } },
            //     ],
            // });
            var isChat = await Chat.find({
                $and: [
                    { users: { $elemMatch: { $eq: req.user._id } } },
                    { users: { $elemMatch: { $eq: userId } } },
                ],
            });
            console.log(isChat);
            try {
                if (isChat.length>0) {
                    return Response.json({ success: true, isChat });
                }
                const user = await User.findById(userId);
                console.log(user);
                const chat = await Chat.create({
                    chatName: user?.email,
                    users: [userId, req.user?._id]
                });
                return Response.json({ success: true, chat });
            }
            catch (e) {
                console.log(e);
                return Response.json({ success: false, msg: "Error - catch block", errror: e });
            }
        } catch (error) {
            return Response.json({ message: 'Not authorized, token failed' });
        }
    } else {
        return Response.json({ message: 'Not authorized, no token' });
    }

};

export async function GET(req: NextRequest) {
    try {
        const chats = await Chat.find();
        return Response.json({ "success": true, chats });
    } catch(e) {
        return Response.json({ "success": false });
    }
};