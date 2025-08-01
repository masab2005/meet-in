'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Send, MoreVertical } from 'lucide-react';
import User from "@/models/User"
import Message from '@/models/Message';
import { IMessage } from '@/models/Message';
import { useUserStore } from '@/lib/store/userStore';

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



  useEffect(() => {
    const socket = io('https://websocket-production-665b.up.railway.app', {
      transports: ['websocket'],
    });
    socketRef.current = socket;
    
    socket.emit('register', user?.name);

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
  }, [receiverName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
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
    setNewMessage('');
  };

  return (
    <div className="h-screen bg-[#f0f0f3] flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <div className="bg-[#e0e0e0] shadow-md p-4 flex items-center gap-3 sticky top-0 z-10">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-white shadow-inner overflow-hidden" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#e0e0e0]" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-lg text-gray-800">{otherUser?.name}</h2>
          <p className="text-sm text-black">{receiverName}</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-[#e0e0e0] shadow hover:shadow-inner flex items-center justify-center">
          <MoreVertical size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-[80%] flex flex-col">
              <div
                className={`px-4 py-3 rounded-2xl relative ${
                  message.sender === 'me'
                    ? 'bg-blue-500 text-white ml-auto shadow'
                    : 'bg-white text-gray-800 shadow-inner'
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
      <div className="bg-[#e0e0e0] p-4 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-2xl resize-none bg-white text-gray-800 border-none outline-none shadow-inner min-h-[48px] max-h-[120px]"
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
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              newMessage.trim()
                ? 'bg-blue-500 text-white shadow'
                : 'bg-gray-300 text-gray-500 shadow-inner'
            } ${isPressed ? 'scale-95' : 'scale-100'}`}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
