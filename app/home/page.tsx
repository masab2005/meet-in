'use client'
// pages/index.tsx
import { useEffect, useState } from "react";
import { IUser } from "@/models/User";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<IUser>();
  const [previousChats, setPreviousChats] = useState<IUser[]>([]);

  const user = useUserStore((state) => state.user);
  const router = useRouter();

  // Fetch previous chats on mount
  useEffect(() => {
    if (!user?._id) return;
    fetch(`/api/previousChats/${user?._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
            console.error("Unexpected response in fetching previous chats:", data);
            return;
        }
        setPreviousChats(data);
      })
      .catch((err) => console.error(err));
  }, [user?._id]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const res = await fetch('/api/findUser',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: searchTerm }),
      });
      if (!res.ok) {
        const text = await res.text(); 
        console.error("Failed to fetch user in home page:", res.status, text);
        return;
      }
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100 p-6">
      {/* Background decoration circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-amber-300/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        
        {/* Main Content Container */}
        <div className="bg-amber-50/50 backdrop-blur-sm rounded-3xl p-6 shadow-[8px_8px_16px_rgba(245,158,11,0.15),-8px_-8px_16px_rgba(255,255,255,0.7)] border border-amber-100/50">
          
          {/* Search Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-amber-900 mb-4">Find Friends</h2>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-amber-50 rounded-2xl border-none shadow-[inset_4px_4px_8px_rgba(245,158,11,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] text-amber-900 placeholder-amber-500 focus:outline-none focus:shadow-[inset_6px_6px_12px_rgba(245,158,11,0.15),inset_-6px_-6px_12px_rgba(255,255,255,0.9)] transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <button 
                onClick={handleSearch}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold rounded-2xl shadow-[4px_4px_8px_rgba(245,158,11,0.3),-2px_-2px_6px_rgba(255,255,255,0.2)] hover:shadow-[6px_6px_12px_rgba(245,158,11,0.4),-3px_-3px_8px_rgba(255,255,255,0.3)] active:shadow-[inset_2px_2px_4px_rgba(245,158,11,0.3)] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Search
              </button>
            </div>

            {/* Search Results */}
            {searchResult && (
              <div className="mt-6 p-4 bg-white/60 rounded-2xl shadow-[inset_2px_2px_4px_rgba(245,158,11,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-200 rounded-full shadow-[inset_2px_2px_4px_rgba(245,158,11,0.2)] flex items-center justify-center">
                      <span className="text-amber-800 font-semibold text-sm">
                        {searchResult.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900">{searchResult.name}</h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push(`/chat/${searchResult?.name}`)}
                    className="px-4 py-2 bg-amber-400 text-white text-sm font-medium rounded-xl shadow-[2px_2px_4px_rgba(245,158,11,0.3)] hover:bg-amber-500 transition-colors duration-200"
                  >
                    Chat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Previous Conversations */}
          <div>
            <h2 className="text-xl font-semibold text-amber-900 mb-4">Previous Conversations</h2>
            
            {previousChats.length > 0 ? (
              <div className="space-y-3">
                {previousChats.map((chat) => (
                  <div 
                    key={chat._id}
                    className="p-4 bg-white/60 rounded-2xl shadow-[inset_2px_2px_4px_rgba(245,158,11,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] hover:shadow-[inset_3px_3px_6px_rgba(245,158,11,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-amber-200 rounded-full shadow-[inset_2px_2px_4px_rgba(245,158,11,0.2)] flex items-center justify-center">
                          <span className="text-amber-800 font-semibold text-sm">
                            {chat.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-amber-900">{chat.name}</h3>
                        </div>
                      </div>
                      <button 
                        onClick={() => router.push(`/chat/${chat.name}`)}
                        className="px-4 py-2 bg-amber-400 text-white text-sm font-medium rounded-xl shadow-[2px_2px_4px_rgba(245,158,11,0.3)] hover:bg-amber-500 transition-colors duration-200"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full shadow-[inset_2px_2px_4px_rgba(245,158,11,0.1)] flex items-center justify-center">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-amber-600 text-sm">No previous conversations</p>
                <p className="text-amber-500 text-xs mt-1">Start chatting to see your conversations here</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-amber-600 text-xs">
            © 2025 MeetIN.
          </p>
        </div>
      </div>
    </div>
  );
}