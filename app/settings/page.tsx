'use client'
import React from 'react'
import ProfilePicButton from '../uploadPic/page'
import { Upload } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useUserStore } from '@/lib/store/userStore';
function Settings() {
    const [uploadPic,setUploadPic] = React.useState<boolean>(false);
    const [removed,setRemoved] = React.useState<boolean>(false);
    const [deleteAccount, setDeleteAccount] = React.useState<boolean>(false);
    const [password, setPassword] = React.useState<string>("");
    const { user } = useUserStore();

    const handleDeleteAccount = async () => {
      if (!password) {
        console.log("Password is required to delete account.");
        return;
      }
      // Proceed with account deletion
      const res = await fetch('/api/deleteAccount', {
        method: 'DELETE',
        body: JSON.stringify({ userId: user?._id, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        console.log("Account deleted successfully.");
        signOut({ callbackUrl: '/landing' });
      } else {
        console.log("Error deleting account.");
      }

    }


    const removeProfilePic = async () => {
      const res = await fetch('/api/removeProfilePic', {
        method: 'POST',
        body: JSON.stringify({ userId: user?._id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setRemoved(true);
        console.log("Profile picture removed successfully.");
      }
    }

  return (
    <div className='flex flex-col justify-center items-align-center'>
        {/* upload profile picture */  }
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <Upload onClick={()=> setUploadPic(prev => !prev)} className='cursor-pointer'/>
        {uploadPic && <ProfilePicButton />}

        {/*remove profile picture*/}
        <button
          onClick={removeProfilePic}
          className="btn-remove"
        >
          Remove Profile Picture
        </button>
        {removed && <p>Profile picture removed successfully.</p>}

        {/* logout */}
        <button
        onClick={() => signOut({ callbackUrl: '/landing' })}
        className="btn-logout"
        >
        Logout
        </button>
        

        {/*Delete account */}
        <button
          onClick={() => setDeleteAccount(prev => !prev)}
          className="btn-delete"
        >
          Delete Account
        </button>
        {deleteAccount && (
          <div>
            <p>Enter your password to confirm deletion:</p>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input-password" />
            <button onClick={handleDeleteAccount} className="btn-confirm">
              Yes, delete my account
            </button>
            <button onClick={() => setDeleteAccount(false)} className="btn-cancel">
              Cancel
            </button>
          </div>
        )}
    </div>
  )
}

export default Settings