"use client";

import {UploadButton} from "@/lib/utils/uploadthing";

export default function ProfilePicButton() {
  return (
    <div>
      <UploadButton
        endpoint="profilePicture"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
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
