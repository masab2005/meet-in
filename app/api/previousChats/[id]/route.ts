import { dbConnect } from "@/lib/dbConn";
import User from "@/models/User";
import Message from "@/models/Message";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
   
    const id = params.id;
    await dbConnect();

    const msgs = await Message.find({
      $or: [{ from: id }, { to: id }],
    });

    if (msgs.length === 0) {
      return NextResponse.json(
        { error: "No previous chats found" },
        { status: 404 }
      );
    }

    // Extract unique user IDs (excluding self)
    const userIds = new Set<string>();
    for (const message of msgs) {
      const uid = message.from.toString() !== id ? message.from : message.to;
      userIds.add(uid.toString());
    }

    const users = await User.find({ _id: { $in: Array.from(userIds) } });

    return NextResponse.json(users);

  } catch (error) {
    console.error("Error finding previous chats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
