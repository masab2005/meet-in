import { dbConnect } from "@/lib/dbConn";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/User";
import Message from "@/models/Message";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { from, to, content, timestamp } = await req.json();

  if (!from || !to || !content || !timestamp) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const newMessage = await Message.create({
    from,
    to,
    content,
    timestamp,
  });

  return NextResponse.json(newMessage);
}