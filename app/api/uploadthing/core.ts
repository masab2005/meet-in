import { createUploadthing, type FileRouter } from "uploadthing/next";
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
    await dbConnect();
    await User.findByIdAndUpdate(metadata.userId, { profilePicture: file.ufsUrl });
  })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
