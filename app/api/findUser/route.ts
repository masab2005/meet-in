import { dbConnect } from "@/lib/dbConn";
import User from "@/models/User";
import { NextResponse,NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try{
    const {name, email, id} = await req.json();
    await dbConnect();
    const user = await User.findOne({
      $or: [
        { name: name },
        { email: email },
        { _id: id }
      ]
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  }catch (error) {
    console.error("Error in findUser route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
