"use client";

import {UploadButton} from "@/lib/utils/uploadthing";

export default function ProfilePicButton() {
  return (
    <div>
      <UploadButton
        className=" bg-blue-400 w-20 h-20 hover:bg-blue-500 rounded-2xl "
        endpoint="profilePicture"
        onClientUploadComplete={(res) => {
          // Do something with the response
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
