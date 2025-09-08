'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Send, MoreVertical, ChevronLeft } from 'lucide-react';
import { useUserStore } from '@/lib/store/userStore';
import Avatar from '@/lib/utils/avatar';
import { useRouter } from 'next/navigation';
import { IUser } from '@/models/User';
import { IMessage } from '@/models/Message';
interface ChatMessage {
  id: string;
  content: string;
  sender: 'me' | 'other'
  createdAt?: string;
}

export default function ChatPage() {
  const { receiverName } = useParams();
  console.log("receiverName:", receiverName);
  const router = useRouter();
  const { user }  = useUserStore()
  const [otherUser, setOtherUser] = useState<IUser | null>(null)
  const [isMoreVeritical,setMoreVertical] = useState<boolean>(false)

  //fetch info of other user
  useEffect(() => {
    const fetchUser = async () => {
      const getOtherUser: IUser = await fetch("/api/findUser",{
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
    const mappedMessages = data.map((msg: IMessage) => ({
      id: msg._id || Date.now().toString(),
      content: msg.content,
      sender: msg.from.toString() === user._id ? 'me' : 'other',
      createdAt: msg.createdAt,
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
        createdAt: new Date().toLocaleTimeString([], {
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
          content: newMessage
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
      {/* Neumorphic Theme + Modern Scrollbar */}
      <style jsx global>{`
        :root {
          --bg: #e9eef5;           /* page background */
          --surface: #f2f5fa;      /* cards / panels */
          --text: #2b2f36;         /* primary text */
          --muted: black;        /* secondary text */
          --accent: #e9e2ff;       /* very soft accent (not blue) */
          --shadow-dark: rgba(0, 0, 0, 0.14);
          --shadow-light: rgba(255, 255, 255, 0.45);
        }

        /* Subtle radial sheen */
        body {
          background:
            radial-gradient(1200px 800px at 10% 0%, #f7f9fd 0%, transparent 50%),
            radial-gradient(1000px 600px at 100% 100%, #f4f7fc 0%, transparent 45%),
            var(--bg);
          color: var(--text);
        }

        /* Reusable neumorphic helpers */
        .neu-surface {
          background: var(--surface);
        }
        .neu-raised {
          box-shadow:
            8px 8px 18px var(--shadow-dark),
            -8px -8px 18px var(--shadow-light);
        }
        .neu-soft {
          box-shadow:
            6px 6px 14px var(--shadow-dark),
            -6px -6px 14px var(--shadow-light);
        }
        .neu-inset {
          box-shadow:
            inset 8px 8px 16px rgba(0,0,0,0.08),
            inset -8px -8px 16px rgba(255,255,255,0.95);
        }
        .neu-pressed {
          box-shadow:
            inset 6px 6px 12px rgba(0,0,0,0.12),
            inset -6px -6px 12px rgba(255,255,255,0.92);
        }
        .neu-ring {
          outline: 0.5px solid rgba(255,255,255,0.6);
          border: 1px solid rgba(0,0,0,0.04);
        }
        .neu-glow {
          box-shadow:
            0 0 0 2px rgba(255,255,255,0.7) inset,
            0 8px 24px rgba(0,0,0,0.06);
        }

        /* Modern, subtle scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #d8deea, #cfd7e5);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #cbd3e2, #c2cbe0);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cfd7e5 transparent;
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-300 via-amber-200 to-amber-300 relative overflow-hidden px-3 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[70vh] w-full gap-6">
            <div className="neu-surface neu-raised rounded-full p-4">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full neu-inset" />
                <div className="absolute inset-3 rounded-full border border-white/60 shadow-[0_0_0_1px_rgba(0,0,0,0.03)_inset] animate-spin"
                     style={{ borderTopColor: '#d9d1f7', borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent', borderStyle: 'solid', borderWidth: '4px' }} />
                <div className="absolute inset-6 rounded-full border border-white/60 animate-spin"
                     style={{ animationDuration: '2.2s', borderTopColor: '#e7e2ff', borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent', borderStyle: 'solid', borderWidth: '3px' }} />
              </div>
            </div>
            <p className="text-sm text-[color:var(--muted)]">Setting up your chat…</p>
          </div>
        ) : (
          <div className="h-[90vh] w-full max-w-xl mx-auto rounded-[2rem] neu-surface neu-raised neu-ring flex flex-col">
            {/* Header */}
           
            <div className="p-4 flex items-center gap-3 sticky top-0 z-10 rounded-t-[2rem]">
            <ChevronLeft className='cursor-pointer' onClick={()=> router.back()}  />
            <Avatar src={otherUser?.profilePicture} name={otherUser?.name} />

              <div className="flex-1"> 
                <h2 className="font-semibold text-[15px] leading-tight text-[color:var(--text)]">{otherUser?.name}</h2>
                <p className="text-xs text-[color:var(--muted)]">online</p>
              </div>
              <div className="relative inline-block">
            {/* Toggle Button */}
            <button
              onClick={() => setMoreVertical(!isMoreVeritical)}
              className="w-10 h-10 rounded-[1.2rem] neu-surface neu-raised hover:neu-soft transition-all duration-200 active:scale-95"
              aria-label="More options"
            >
              <MoreVertical size={18} className="mx-auto text-[color:var(--muted)]" />
            </button>

            {/* Dropdown */}
            {isMoreVeritical && (
              <div
                className="absolute right-0 mt-2 w-40 rounded-xl neu-surface neu-raised shadow-lg overflow-hidden animate-fadeIn z-50"
              >
                <button
                  onClick={() => router.push('/home')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-200 transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => router.push('/settings')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-200 transition-colors"
                >
                  Settings
                </button>
              </div>
            )}
          </div>

            </div>

            {/* Messages */}
            <div className="flex-1 bg-[#f1ebde] overflow-y-auto py-2 px-4 pb-5 space-y-4 custom-scrollbar">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[82%] flex flex-col ">
                    <div
                      className={`px-4 py-3 rounded-[1.6rem] relative leading-relaxed ${
                        message.sender === 'me'
                          ? 'neu-surface neu-raised'
                          : 'neu-surface neu-raised '
                      }`}
                      style={message.sender === 'me' ? { background: '#F5D094' } : { background: 'var(--surface)' }}
                    >
                      <p className="text-[13.5px] text-[color:var(--text)]">{message.content}</p>
                    </div>
                    <span
                      className={`text-[9px] mt-1 px-2 ${
                        message.sender === 'me' ? 'text-[color:var(--muted)]   text-right' : 'text-[color:var(--muted)] text-left'
                      }`}
                    >
                      {new Date(message.createdAt!).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 sticky bottom-0 rounded-b-[2rem]">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 px-4 py-3 rounded-[1.6rem] resize-none neu-surface neu-inset text-[color:var(--text)] border-none outline-none min-h-[52px] max-h-[140px] custom-scrollbar placeholder:text-[color:var(--muted)]"
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
                  className={`w-12 h-12 rounded-[1.6rem] flex items-center justify-center transition-all duration-200 ${
                    newMessage.trim()
                      ? 'neu-surface neu-raised hover:neu-soft'
                      : 'neu-surface neu-inset'
                  } ${isPressed ? 'scale-95' : 'scale-100'} ${newMessage.trim() ? 'outline outline-[rgba(0,0,0,0.04)]' : ''}`}
                  aria-label="Send message"
                >
                  <Send size={18} className={newMessage.trim() ? 'text-[color:var(--text)]' : 'text-[color:var(--muted)]'} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
