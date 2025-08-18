import { dbConnect } from "@/lib/dbConn";
import { NextResponse, NextRequest } from "next/server";
import Message from "@/models/Message";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { from, to, content, createdAt } = await req.json();

  if (!from || !to || !content || !createdAt) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const newMessage = await Message.create({
    from,
    to,
    content
  });

  return NextResponse.json(newMessage);
}