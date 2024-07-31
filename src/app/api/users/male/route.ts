import { ensureDbConnect } from "@/app/db/dbConnect";
import { User } from "@/app/db/user";

export async function GET() {
  await ensureDbConnect();
  try {
    const users = await User.find({gender: 'male'});
    return Response.json(users);
  } catch {
    return Response.json({ msg: "Error- catch block" });
  }
}