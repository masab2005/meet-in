'use client'
import React from 'react'
import ProfilePicButton from '../uploadPic/page'
import { Upload } from 'lucide-react';
import { signOut } from 'next-auth/react';
function Settings() {
    const [uploadPic,setUploadPic] = React.useState(false);
  return (
    <div>
        {/* upload profile picture */  }
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <Upload onClick={()=> setUploadPic(prev => !prev)} className='cursor-pointer'/>
        {uploadPic && <ProfilePicButton />}

        {/* logout */}
        <button
        onClick={() => signOut({ callbackUrl: '/landing' })}
        className="btn-logout"
        >
        Logout
        </button>

        {/*Delete account */}
        <button
          onClick={() => {/* handle delete account */}}
          className="btn-delete"
        >
          Delete Account
        </button>
    </div>
  )
}

export default Settings