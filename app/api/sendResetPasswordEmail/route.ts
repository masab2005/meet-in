
import { dbConnect } from "@/lib/dbConn";
import User from "@/models/User";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";


export async function POST(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "If that email exists, a reset link has been sent" }, { status: 200 });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

      
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${rawToken}&email=${email}`;

        
        const transporter = nodemailer.createTransport({
            service: "gmail", // change to your email service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"MeetIN" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset Request",
            html: `
                <p>You requested to reset your password of your MeetIN account.</p>
                <p>Click the link below to reset it (valid for 15 minutes):</p>
                <a href="${resetUrl}" target="_blank">${resetUrl}</a>
            `,
        };

        
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "If that email exists, a reset link has been sent" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
