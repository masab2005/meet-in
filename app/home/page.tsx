'use client'
// pages/index.tsx
import { useEffect, useState } from "react";
import { IUser } from "@/models/User";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { Settings, MessageCircle, Search, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import Avatar from "@/lib/utils/avatar";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<IUser>();
  const [previousChats, setPreviousChats] = useState<IUser[]>([]);
  const [searchError, setSearchError] = useState("");
  const [chatsError, setChatsError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);

  const user = useUserStore((state) => state.user);
  const router = useRouter();

  // Fetch previous chats on mount
  useEffect(() => {
    if (!user?._id) {
      setIsLoadingChats(false);
      return;
    }
    
    const fetchPreviousChats = async () => {
      try {
        setIsLoadingChats(true);
        setChatsError("");
        
        const res = await fetch(`/api/previousChats/${user._id}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch previous chats: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (!Array.isArray(data)) {
          console.error("Unexpected response in fetching previous chats:", data);
          throw new Error("Invalid response format from server");
        }
        
        setPreviousChats(data);
      } catch (err) {
        console.error("Error fetching previous chats:", err);
        setChatsError("Failed to load previous conversations. Please try again.");
        setPreviousChats([]);
      } finally {
        setIsLoadingChats(false);
      }
    };

    fetchPreviousChats();
  }, [user?._id]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchError("Please enter a username to search");
      return;
    }
    
    try {
      setIsSearching(true);
      setSearchError("");
      setSearchResult(undefined);
      
      const res = await fetch('/api/findUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: searchTerm }),
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          setSearchError(`No user found with username "${searchTerm}"`);
        } else if (res.status >= 500) {
          setSearchError("Server error occurred. Please try again later.");
        } else {
          const text = await res.text();
          console.error("Failed to fetch user in home page:", res.status, text);
          setSearchError("Failed to search for user. Please try again.");
        }
        return;
      }
      
      const data = await res.json();
      
      if (!data) {
        setSearchError(`No user found with username "${searchTerm}"`);
        return;
      }
      
      setSearchResult(data);
    } catch (err) {
      console.error("Search error:", err);
      setSearchError("Network error occurred. Please check your connection and try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const retryLoadChats = () => {
    if (user?._id) {
      // Trigger useEffect to reload chats
      setPreviousChats([]);
      setChatsError("");
      setIsLoadingChats(true);
      
      // Small delay to show loading state
      setTimeout(() => {
        fetch(`/api/previousChats/${user._id}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch previous chats: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            if (!Array.isArray(data)) {
              console.error("Unexpected response in fetching previous chats:", data);
              throw new Error("Invalid response format from server");
            }
            setPreviousChats(data);
            setChatsError("");
          })
          .catch((err) => {
            console.error("Retry error:", err);
            setChatsError("Failed to load previous conversations. Please try again.");
            setPreviousChats([]);
          })
          .finally(() => {
            setIsLoadingChats(false);
          });
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-200 via-amber-200 to-amber-300 relative overflow-hidden">
      
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
                boxShadow: 'inset 6px 6px 12px rgba(165, 119, 6, 0.15), inset -6px -6px 12px rgba(165, 119, 6, 0.15)'
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

            {/* Search Error */}
            {searchError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl transition-all duration-300">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{searchError}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className={`flex items-center bg-gray-50 border rounded-xl p-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-amber-200 ${
                searchError ? 'border-red-300 hover:border-red-400 focus-within:border-red-400' : 'border-gray-200 hover:border-amber-300 focus-within:border-amber-400'
              }`}
                   style={{
                     boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                   }}>
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search username"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (searchError) setSearchError(""); // Clear error when typing
                  }}
                  onKeyPress={handleKeyPress}
                  className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 py-1"
                  disabled={isSearching}
                />
              </div>
              
              <button 
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-200 flex items-center justify-center ${
                  isSearching || !searchTerm.trim()
                    ? 'bg-amber-400 cursor-not-allowed' 
                    : 'bg-amber-500 hover:bg-amber-600 hover:scale-[1.02] cursor-pointer'
                } text-white`}
                style={{
                  boxShadow: '6px 6px 12px rgba(217, 119, 6, 0.2), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                }}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
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
                      <Avatar src={searchResult?.profilePicture} name={searchResult?.name} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {searchResult.name === user?.name ? `${searchResult.name} (You)` : searchResult.name}
                      </h3>

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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Previous Conversations</h2>
              {chatsError && (
                <button
                  onClick={retryLoadChats}
                  disabled={isLoadingChats}
                  className="text-amber-600 hover:text-amber-700 transition-colors duration-200 p-1 rounded-lg hover:bg-amber-50 disabled:opacity-50"
                  title="Retry loading conversations"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingChats ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>

            {/* Chats Error */}
            {chatsError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{chatsError}</p>
                  </div>
                  <button
                    onClick={retryLoadChats}
                    disabled={isLoadingChats}
                    className="text-red-600 hover:text-red-700 text-sm font-medium underline disabled:opacity-50"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            
            {isLoadingChats ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center"
                     style={{
                       boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                     }}>
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
                <p className="text-gray-600 text-sm">Loading conversations...</p>
              </div>
            ) : previousChats.length > 0 ? (
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
                          <Avatar src={chat?.profilePicture} name={chat?.name} />
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
                        disabled={isLoadingChats}
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