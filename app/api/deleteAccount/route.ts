import { dbConnect } from "@/lib/dbConn";
import Message from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { password } = await req.json();
  await dbConnect();

  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  }

  await Message.deleteMany({
    $or: [{ from: user.id }, { to: user.id }]
  });

  await User.findByIdAndDelete(user.id);

  return NextResponse.json({
    message: "Account deleted successfully",
    deletedUserId: user.id
  }, { status: 200 });
}
