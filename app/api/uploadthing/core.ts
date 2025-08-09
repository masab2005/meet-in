import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // your NextAuth config
import { getToken } from "next-auth/jwt";
import { dbConnect } from "@/lib/dbConn";
import  User  from "@/models/User";
const f = createUploadthing();

export const ourFileRouter = {
  profilePicture: f({ image: { maxFileSize: "4MB" ,maxFileCount: 1} })
  .middleware(async ({ req }) => {
    const token = await getToken({ req });
    if (!token?.id) throw new Error("Unauthorized");

    return { userId: token.id };
  })
  .onUploadComplete(async ({ file, metadata }) => {
    console.log("meta data:", metadata); // Debug here

    console.log("Uploaded:", file.ufsUrl);
    await dbConnect();
    await User.findByIdAndUpdate(metadata.userId, { profilePicture: file.ufsUrl });
  })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
