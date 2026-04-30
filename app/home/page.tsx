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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="neumorph-card max-w-[500px] w-full mx-auto p-6 sm:p-10 flex flex-col space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1 text-center pl-10"> {/* Offset for balance with settings button */}
              <div className="w-20 h-20 bg-amber-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MessageCircle className="w-10 h-10 text-amber-700" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">MeetIN</h1>
              <p className="text-gray-500 text-sm mt-1">Connect with friends seamlessly</p>
            </div>
            
            <button
              onClick={() => router.push('/settings')}
              className="neumorph-icon-button group"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-amber-700 group-hover:rotate-45 transition-transform duration-500" />
            </button>
          </div>

          {/* Search Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-bold text-gray-800">Find Friends</h2>
            </div>

            {searchError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm font-medium">{searchError}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className={`neumorph-input-container ${searchError ? 'ring-2 ring-red-200 border-red-300' : ''}`}>
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search by username..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (searchError) setSearchError("");
                  }}
                  onKeyPress={handleKeyPress}
                  className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400 text-base"
                  disabled={isSearching}
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className={`neumorph-button w-full ${isSearching || !searchTerm.trim() ? 'opacity-70 cursor-not-allowed grayscale-[0.2]' : ''}`}
              >
                {isSearching ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  'Search'
                )}
              </button>
            </div>

            {/* Search Results */}
            {searchResult && (
              <div className="mt-6 p-5 bg-amber-50/50 border border-amber-100 rounded-xl animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 ring-2 ring-amber-200 rounded-full overflow-hidden bg-white">
                      <Avatar src={searchResult?.profilePicture} name={searchResult?.name} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {searchResult.name === user?.name ? `${searchResult.name} (You)` : searchResult.name}
                      </h3>
                      <p className="text-xs text-amber-600 font-medium">Available to chat</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/chat/${searchResult?.name}`)}
                    className="neumorph-button-secondary py-2.5 px-5"
                  >
                    Chat
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Previous Conversations */}
          <section className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-xl font-bold text-gray-800">Recent Chats</h2>
              {chatsError && (
                <button
                  onClick={retryLoadChats}
                  disabled={isLoadingChats}
                  className="p-2 text-amber-600 hover:bg-amber-100 rounded-full transition-colors disabled:opacity-50"
                  title="Retry loading"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingChats ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>

            {chatsError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                    <p className="text-red-700 text-sm">{chatsError}</p>
                  </div>
                  <button
                    onClick={retryLoadChats}
                    className="text-red-600 text-xs font-bold uppercase tracking-wider hover:underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {isLoadingChats ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center animate-pulse border border-gray-100">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
                <p className="text-gray-400 text-sm font-medium">Syncing your conversations...</p>
              </div>
            ) : previousChats.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {previousChats.map((chat) => (
                  <div
                    key={chat._id}
                    className="group p-4 bg-gray-50/50 border border-gray-100 rounded-2xl hover:border-amber-300 hover:bg-white transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-amber-100">
                          <Avatar src={chat?.profilePicture} name={chat?.name} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 group-hover:text-amber-700 transition-colors uppercase tracking-tight text-sm">
                            {chat.name}
                          </h3>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push(`/chat/${chat.name}`)}
                        className="neumorph-button-secondary opacity-80 group-hover:opacity-100"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No messages yet</p>
                <p className="text-gray-400 text-xs mt-1">Start a search to find friends</p>
              </div>
            )}
          </section>
        </div>
      </div>

    </div>
  );
}