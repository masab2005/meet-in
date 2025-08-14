    import { dbConnect } from "@/lib/dbConn";
    import User from "@/models/User";
    import { NextResponse,NextRequest } from "next/server";
    import crypto from "crypto"

    export async function POST(req: NextRequest){
        const { email, token, password } = await req.json();
        if(!email || !token || !password){
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await dbConnect();
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");


        const user = await User.findOne({
            email,
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }, 
        });
        if (!user) {
            return NextResponse.json({ error: "Invalid token or email" }, { status: 400 });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return NextResponse.json({ message: "Password reset successful" });
    }