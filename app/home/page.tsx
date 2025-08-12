'use client'
// pages/index.tsx
import { useEffect, useState } from "react";
import { IUser } from "@/models/User";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { Settings, MessageCircle, Search, User } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-amber-200 via-amber-200 to-amber-300 relative overflow-hidden">
      {/* Animated background elements - Same as login/register */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200 rounded-full opacity-20" 
             style={{
               animation: 'float 6s ease-in-out infinite',
               animationDelay: '0s'
             }}></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-amber-300 rounded-full opacity-30"
             style={{
               animation: 'slowFloat 8s ease-in-out infinite', 
               animationDelay: '2s'
             }}></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-amber-400 rounded-full opacity-25"
             style={{
               animation: 'float 6s ease-in-out infinite',
               animationDelay: '4s'
             }}></div>
      </div>

      {/* Animation keyframes */}
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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div 
          className="bg-white text-gray-700 max-w-[500px] w-full mx-4 p-8 text-left text-sm rounded-2xl transition-all duration-300"
          style={{
            boxShadow: '15px 15px 30px rgba(217, 119, 6, 0.12), -15px -15px 30px rgba(255, 119, 6, 0.09)'
          }}
        >
          {/* Header with Settings */}
          <div className="flex justify-between items-center mb-8">
            {/* Logo and Title */}
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-amber-700" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">MeetIN</h1>
              <p className="text-gray-600 text-sm">Connect with friends seamlessly</p>
            </div>

            {/* Settings Icon - Top Right */}
            
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <div className="flex justify-between ">
            <h2 className="text-lg font-semibold text-gray-800 mt-3">Find Friends</h2>
            <button 
              onClick={() => router.push('/settings')}
              className="w-10 h-10 bg-amber-200 text-amber-600 border mb-2.5 border-gray-200 rounded-xl flex items-center justify-center transition-all duration-300 hover:border-amber-300 hover:bg-amber-50"
 
            >
              <Settings className="w-5 h-5 text-amber-700 hover: transition-colors" />
            </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-3 transition-all duration-300 hover:border-amber-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200"
                   style={{
                     boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                   }}>
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 py-1"
                />
              </div>
              
              <button 
                onClick={handleSearch}
                className="w-full cursor-pointer bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-amber-200"
                style={{
                  boxShadow: '6px 6px 12px rgba(217, 119, 6, 0.2), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                }}
              >
                Search
              </button>
            </div>

            {/* Search Results */}
            {searchResult && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl"
                   style={{
                     boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                   }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{searchResult.name}</h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push(`/chat/${searchResult?.name}`)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    style={{
                      boxShadow: '3px 3px 6px rgba(217, 119, 6, 0.2), -3px -3px 6px rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    Chat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Previous Conversations */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Previous Conversations</h2>
            
            {previousChats.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {previousChats.map((chat) => (
                  <div 
                    key={chat._id}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200 hover:border-amber-300"
                    style={{
                      boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-amber-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{chat.name}</h3>
                        </div>
                      </div>
                      <button 
                        onClick={() => router.push(`/chat/${chat.name}`)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        style={{
                          boxShadow: '3px 3px 6px rgba(217, 119, 6, 0.2), -3px -3px 6px rgba(255, 255, 255, 0.9)'
                        }}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center"
                     style={{
                       boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                     }}>
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm mb-1">No previous conversations</p>
                <p className="text-gray-500 text-xs">Start chatting to see your conversations here</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}