'use client'
import React from 'react'
import ProfilePicButton from '../uploadPic/page'
import { Upload, Settings, ChevronLeft } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useUserStore } from '@/lib/store/userStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function SettingsPage() {
  const router = useRouter();
  const [uploadPic, setUploadPic] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [password, setPassword] = useState("");
  const { user } = useUserStore();

  const handleDeleteAccount = async () => {
    if (!password) return;
    const res = await fetch('/api/deleteAccount', {
      method: 'DELETE',
      body: JSON.stringify({ userId: user?._id, password }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      signOut({ callbackUrl: '/landing' });
    }
  }

  const removeProfilePic = async () => {
    const res = await fetch('/api/removeProfilePic', {
      method: 'POST',
      body: JSON.stringify({ userId: user?._id }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      setRemoved(true);
    }
  }

  return (
    <div className="flex items-center justify-center py-15 min-h-screen bg-gradient-to-br from-amber-200 via-amber-200 to-amber-300 relative overflow-hidden">
      
      {/* Floating circles like LoginPage */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200 rounded-full opacity-20 animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-amber-300 rounded-full opacity-30 animate-[slowFloat_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-amber-400 rounded-full opacity-25 animate-[float_6s_ease-in-out_infinite] delay-200"></div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slowFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
      `}</style>

      <div 
        className="relative z-10 bg-white text-gray-700 max-w-[400px] w-full mx-4 p-8 rounded-2xl shadow-lg text-sm"
        style={{
          boxShadow: '15px 15px 30px rgba(217, 119, 6, 0.12), -15px -15px 30px rgba(255, 255, 255, 0.09)'
        }}
      >
        
        {/* Header */}
        <div className="text-center mb-8">
          <ChevronLeft className="cursor-pointer" onClick={() => router.back()} />
          <div className="w-16 h-16 bg-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-amber-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Settings</h2>
          <p className="text-gray-600 text-sm">Manage your MeetIN account</p>
        </div>

        {/* Profile Picture */}
        <div className="mb-6">
          <button
            onClick={() => setUploadPic(!uploadPic)}
            className="w-full mb-3 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:border-amber-300 transition"
          >
            <Upload className="w-5 h-5 inline-block mr-2 text-amber-600" />
            Upload Profile Picture
          </button>
          {uploadPic && (
            <div className="flex justify-center mb-1 p-3 border border-gray-200 rounded-xl">
              <ProfilePicButton  />
            </div>
          )}
          <button
            onClick={removeProfilePic}
            className="w-full py-2 bg-gray-50 border border-gray-200 rounded-xl hover:border-red-300 transition text-red-600"
          >
            Remove Picture
          </button>
          {removed && <p className="text-gray-950 mt-2 text-sm">Profile picture removed.</p>}
        </div>

        {/* Actions */}
        <div className="mb-6">
          <button
            onClick={() => signOut({ callbackUrl: '/landing' })}
            className="w-full mb-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition"
          >
            Logout
          </button>
          <button
            onClick={() => setDeleteAccount(!deleteAccount)}
            className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition"
          >
            Delete Account
          </button>
        </div>

        {/* Delete confirmation */}
        {deleteAccount && (
          <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-6">
            <p className="text-sm text-red-600 mb-3">Enter password to delete account:</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-3 px-3 py-2 border border-gray-200 rounded-xl focus:border-red-400 outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleteAccount(false)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-500 mt-4">© 2025 MeetIN</p>
      </div>
    </div>
  )
}

export default SettingsPage;
