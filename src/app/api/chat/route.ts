import { ensureDbConnect } from "@/app/db/dbConnect";
import { Chat } from "@/app/db/chat";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";


export async function GET() {
    try {
        const secretKey = "secret123";
        let userId;
        let token = cookies().get("token")?.value;
        if (token) {
            try {
                const decoded = jwt.verify(token, secretKey);
                userId = decoded?.id;
            } catch (error) {
                console.error("Invalid or expired token", error);
            }
        } else {
            console.log("No token found");
        }
        await ensureDbConnect();

        var chats = await Chat.find(

            { users: { $elemMatch: { $eq: userId } } },
        ).populate("users");
        
        return Response.json({ success: true, chats: chats });
    }

    catch (error) {
        return Response.json({ message: 'Not authorized, token failed' });
    }
}


