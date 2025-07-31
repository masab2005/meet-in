import {dbConnect} from '@/lib/dbConn';
import {NextResponse,NextRequest} from 'next/server';
import User from '@/models/User'
export async function POST(request: NextRequest){
    try{
        const {name,email,password} = await request.json()
        if(!name || !email || !password){
            return NextResponse.json(
                {error: "Provide all credentials"},
                {status: 400}
            );
        }
        await dbConnect();
        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json(
                {error: "Email is already in use"},
                {status: 400}
            )
        }
        const user = await User.create({ name,email,password })
        if(user){
            return NextResponse.json(
                {message: "User registered Please login"},
                {status: 200}
            );
        }
    }catch(error){
        console.error("Registration error", error);
        return NextResponse.json(
        { error: "Failed to register user" },
        { status: 400 }
        );
    }
}  