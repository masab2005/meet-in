import { dbConnect } from "@/lib/dbConn";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:  NextRequest){
    const { userId } = await req.json();
    await dbConnect();
    await User.findByIdAndUpdate(userId, { profilePicture: "" });
    return NextResponse.json({ message: "Profile picture removed successfully." });
}