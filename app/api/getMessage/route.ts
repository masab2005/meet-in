import { dbConnect } from "@/lib/dbConn";
import { NextResponse, NextRequest } from "next/server";
import Message from "@/models/Message";
import { IMessage } from "@/models/Message";
export async function POST(req: NextRequest) {
  await dbConnect();

  const { from, to} = await req.json();

  if (!from || !to) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const messages: IMessage[] = await Message.find({
    $or: [
      { from: from, to: to },
      { from: to, to: from },
    ],
  }).sort({ createdAt: -1 }).limit(50)

  return NextResponse.json(messages.reverse(), { status: 200 } );
}