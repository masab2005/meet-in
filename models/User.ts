import mongoose,{Schema,model,models} from "mongoose";
import bcrypt from "bcryptjs";
export interface IUser {
    name: string;
    email: string;
    password: string;
    profilePicture?: string;
    online: boolean;
    socketId?: string;
    _id?: string;
    resetPasswordToken: String;
    resetPasswordExpire: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<IUser>({

    name: {type: String,required: true,unique: true},
    email: {type: String,required: true,unique: true},
    password: {type: String,required: true},
    profilePicture: {type: String,default:""},
    online: {type: Boolean,default: false},
    socketId: {type: String,default: ""},
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpire: { type: Date, default: null }

},{timestamps: true});

UserSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

const User = models.User || model<IUser>("User",UserSchema,"users");

export default User;