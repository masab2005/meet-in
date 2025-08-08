'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Send, MoreVertical } from 'lucide-react';
import User from "@/models/User"
import { useUserStore } from '@/lib/store/userStore';
import { set } from 'mongoose';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'me' | 'other';
  timestamp: string;
}

export default function ChatPage() {
  const { receiverName } = useParams();
  console.log("receiverName:", receiverName);
  const { user }  = useUserStore()
  const [otherUser, setOtherUser] = useState<typeof User | null>(null)

  //fetch info of other user
  useEffect(() => {
    const fetchUser = async () => {
      const getOtherUser = await fetch("/api/findUser",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: receiverName?.valueOf() })
      }).then(res => res.json()).catch(err => {
        console.error("Error fetching user:", err);
        return null;
      })
      setOtherUser(getOtherUser)
    }
    fetchUser()
  }, [receiverName])
  const [isPressed, setIsPressed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [loading, setLoading] = useState(true);

  //load previous messages
  useEffect(() => {
    const fetchMessages = async() =>{ 
      if (!user?.name || !otherUser?.name) return;
      const res = await fetch('/api/getMessage',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: user, to: otherUser })
      })
      if (!res.ok) {
      const text = await res.text(); // log actual response body
      console.error("Failed to fetch messages:", res.status, text);
      return;
    }

    const data = await res.json(); 
    const mappedMessages = data.map((msg: any) => ({
      id: msg._id || Date.now().toString(),
      content: msg.content,
      sender: msg.from.toString() === user._id ? 'me' : 'other',
      timestamp: msg.timestamp,
    }));

    setMessages(mappedMessages); 
  
    }
    fetchMessages();
  },[user, otherUser]);


  useEffect(() => {
    const socket = io('https://websocket-production-665b.up.railway.app', {
      transports: ['websocket'],
    });
    socketRef.current = socket;
    
    if (user?.name) {
    console.log("Emitting register for", user.name);
    socket.emit('register', user.name);
    setLoading(false);
   } else {
    console.warn("User name is undefined, not registering");
   }

    socket.on('connect', () => {
      console.log('Connected to socket.io server');
    });
    socket.on('private_message', ({ from, message }) => {
      if (from === otherUser?.name) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: message,
            sender: 'other',
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ]);
      }
    });

    return () => {
      socket.disconnect();
      
    };
  }, [user?.name, otherUser?.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socketRef.current?.emit('private_message', {
      from: user?.name,
      to: otherUser?.name,
      message: newMessage,
    });
  
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: newMessage,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    
    // Save the message to the database
    try {
    const res = await fetch('/api/setMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: user,
        to: otherUser,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),

      })
    });

    if (!res.ok) {
      console.error("Failed to save message:", await res.text());
    }
  }catch(err) {
    console.error("Error sending message:", err);
  }
  setNewMessage('');
  };

  return (
    <>
      {/* Modern Scrollbar Styling */}
      <style jsx global>{`
          /* Webkit browsers (Chrome, Safari, Edge) */
          .custom-scrollbar::-webkit-scrollbar {
            width: 2px;
            height: 2px; /* for horizontal scrollbars */
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: white;
            border-radius: 4px;
            transition: background 0.3s ease;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #e5e5e5;
          }

          /* Remove up/down arrow buttons in WebKit */
          .custom-scrollbar::-webkit-scrollbar-button {
            display: none;
            height: 0;
            width: 0;
          }

          /* Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: white transparent;
          }

          /* Smooth scrolling behavior */
          .custom-scrollbar {
            scroll-behavior: smooth;
          }
      `}</style>

      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 relative overflow-hidden'>
        {loading? (
          <div className="flex flex-col items-center justify-center h-screen w-full gap-4">
            <div className="w-20 h-20 border-4 border-t-blue-400 border-transparent rounded-full animate-spin flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-t-red-400 border-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="h-screen rounded-3xl bg-[#f4efe1] flex flex-col max-w-md mx-auto relative">
            {/* Header */}
            <div className="bg-[#ffffff] p-4 flex items-center gap-3 sticky top-0 z-10 rounded-b-[2rem] rounded-t-[2rem] shadow-[4px_4px_10px_rgba(0,0,0,0.1)]">
              <div className="relative">
                <div className="w-12 h-12 rounded-[2rem] bg-gray-600 shadow-[inset_-4px_-4px_10px_rgba(255,255,255,0.6),inset_4px_4px_10px_rgba(0,0,0,0.05)]" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#e0e0e0]" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg text-gray-700">{otherUser?.name}</h2>
                <p className="text-sm text-gray-400">online</p>
              </div>
              <button className="w-10 h-10 rounded-[1.5rem] bg-[#f4efe1] flex items-center justify-center">
                <MoreVertical size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Messages - Added custom-scrollbar class */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[80%] flex flex-col">
                    <div
                      className={`px-4 py-3 rounded-[2rem] relative ${
                        message.sender === 'me'
                          ? 'bg-[#ffdc83] text-gray-800 font-sans shadow-[4px_4px_12px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)]'
                          : 'bg-[#f0efef] text-gray-800 font-sans shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.7),inset_4px_4px_8px_rgba(0,0,0,0.05)]'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span
                      className={`text-xs mt-1 px-2 ${
                        message.sender === 'me' ? 'text-right text-gray-300' : 'text-left text-gray-500'
                      }`}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-[#fefffe] p-4 sticky bottom-0 rounded-t-[2rem] rounded-b-[2rem] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-[2rem] resize-none bg-[#f7f6f3] text-gray-800 border-none outline-none shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.6),inset_4px_4px_8px_rgba(0,0,0,0.05)] min-h-[48px] max-h-[120px] custom-scrollbar"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  onMouseDown={() => setIsPressed(true)}
                  onMouseUp={() => setIsPressed(false)}
                  onMouseLeave={() => setIsPressed(false)}
                  disabled={!newMessage.trim()}
                  className={`w-12 h-12 rounded-[2rem] flex items-center justify-center transition-all duration-200 ${
                    newMessage.trim()
                      ? 'bg-blue-400 text-white shadow-[4px_4px_10px_rgba(0,0,0,0.15)]'
                      : 'bg-gray-300 text-gray-500 shadow-[inset_-4px_-4px_6px_rgba(255,255,255,0.6),inset_4px_4px_6px_rgba(0,0,0,0.05)]'
                  } ${isPressed ? 'scale-95' : 'scale-100'}`}
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}