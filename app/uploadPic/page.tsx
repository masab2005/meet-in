"use client";

import {UploadButton} from "@/lib/utils/uploadthing";
import { useUserStore } from "@/lib/store/userStore";

export default function ProfilePicButton() {
  return (
    <div>
      <UploadButton
        className=" bg-blue-400 w-20 h-20 hover:bg-blue-500 rounded-2xl "
        endpoint="profilePicture"
        onClientUploadComplete={(res) => {
          // Do something with the response
          if (res && res[0]) {
             const newUrl = res[0].serverData?.file?.ufsUrl || res[0].appUrl || res[0].url;
             if (useUserStore.getState().user) {
                 useUserStore.getState().setUser({
                    ...useUserStore.getState().user!,
                    profilePicture: newUrl
                 });
             }
          }
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
}
