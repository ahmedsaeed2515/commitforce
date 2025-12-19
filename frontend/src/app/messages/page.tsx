'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';
import { 
  MessageCircle, Search, Send, ArrowLeft, MoreVertical,
  Phone, Video, Trash2, Check, CheckCheck, Smile, Paperclip,
  Users, Star, Clock, Circle
} from 'lucide-react';

// Mock data for demonstration - In production, this would come from API
interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participant: {
    _id: string;
    fullName: string;
    username: string;
    avatar?: string;
    isOnline?: boolean;
  };
  lastMessage?: Message;
  unreadCount: number;
}

// Mock conversations
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participant: {
      _id: 'user1',
      fullName: 'Ahmed Hassan',
      username: 'ahmedh',
      isOnline: true,
    },
    lastMessage: {
      id: 'm1',
      content: 'Great progress on your challenge!',
      senderId: 'user1',
      receiverId: 'me',
      createdAt: new Date().toISOString(),
      read: false,
    },
    unreadCount: 2,
  },
  {
    id: '2',
    participant: {
      _id: 'user2',
      fullName: 'Sara Mohamed',
      username: 'saramos',
      isOnline: false,
    },
    lastMessage: {
      id: 'm2',
      content: 'Thank you for joining our club!',
      senderId: 'user2',
      receiverId: 'me',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      read: true,
    },
    unreadCount: 0,
  },
  {
    id: '3',
    participant: {
      _id: 'user3',
      fullName: 'Omar Khaled',
      username: 'omark',
      isOnline: true,
    },
    lastMessage: {
      id: 'm3',
      content: 'Let\'s start a group challenge together?',
      senderId: 'me',
      receiverId: 'user3',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      read: true,
    },
    unreadCount: 0,
  },
];

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading conversations
    setTimeout(() => {
      setConversations(MOCK_CONVERSATIONS);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      // Simulate loading messages
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hey! How\'s your challenge going?',
          senderId: selectedConversation.participant._id,
          receiverId: 'me',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          read: true,
        },
        {
          id: '2',
          content: 'It\'s going great! I\'ve been consistent for 7 days now.',
          senderId: 'me',
          receiverId: selectedConversation.participant._id,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          read: true,
        },
        {
          id: '3',
          content: 'That\'s amazing! Keep it up! 🔥',
          senderId: selectedConversation.participant._id,
          receiverId: 'me',
          createdAt: new Date().toISOString(),
          read: true,
        },
      ];
      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: 'me',
      receiverId: selectedConversation.participant._id,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    toast.success('Message sent!');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);

    if (hours < 1) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(c =>
    c.participant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 h-screen flex">
        {/* Sidebar - Conversations List */}
        <div className={`w-full md:w-96 bg-[#0a0a1a] border-r border-white/10 flex flex-col ${
          selectedConversation ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Messages</h1>
                  {totalUnread > 0 && (
                    <p className="text-indigo-400 text-sm">{totalUnread} unread</p>
                  )}
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/50">No conversations yet</p>
                <Link href="/users" className="text-indigo-400 text-sm hover:underline mt-2 inline-block">
                  Find users to chat with
                </Link>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-white/5 transition border-b border-white/5 ${
                    selectedConversation?.id === conversation.id ? 'bg-white/10' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    {conversation.participant.avatar ? (
                      <Image
                        src={conversation.participant.avatar}
                        alt={conversation.participant.fullName}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {conversation.participant.fullName[0]}
                      </div>
                    )}
                    {conversation.participant.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0a0a1a]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {conversation.participant.fullName}
                      </h3>
                      <span className="text-xs text-white/40">
                        {conversation.lastMessage && formatTime(conversation.lastMessage.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/50 truncate">
                        {conversation.lastMessage?.senderId === 'me' && 'You: '}
                        {conversation.lastMessage?.content}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 w-5 h-5 bg-indigo-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${
          !selectedConversation ? 'hidden md:flex' : 'flex'
        }`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0a0a1a]/80 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 hover:bg-white/5 rounded-lg transition"
                  >
                    <ArrowLeft className="w-5 h-5 text-white/70" />
                  </button>
                  <div className="relative">
                    {selectedConversation.participant.avatar ? (
                      <Image
                        src={selectedConversation.participant.avatar}
                        alt={selectedConversation.participant.fullName}
                        width={44}
                        height={44}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {selectedConversation.participant.fullName[0]}
                      </div>
                    )}
                    {selectedConversation.participant.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a1a]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {selectedConversation.participant.fullName}
                    </h3>
                    <p className="text-xs text-white/50">
                      {selectedConversation.participant.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2.5 hover:bg-white/5 rounded-xl transition text-white/50 hover:text-white">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 hover:bg-white/5 rounded-xl transition text-white/50 hover:text-white">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 hover:bg-white/5 rounded-xl transition text-white/50 hover:text-white">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => {
                  const isMe = message.senderId === 'me';
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                        <div className={`rounded-2xl px-4 py-3 ${
                          isMe 
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                            : 'bg-white/10 text-white'
                        }`}>
                          <p>{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs text-white/40">
                            {formatTime(message.createdAt)}
                          </span>
                          {isMe && (
                            message.read 
                              ? <CheckCheck className="w-3.5 h-3.5 text-indigo-400" />
                              : <Check className="w-3.5 h-3.5 text-white/40" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/10 bg-[#0a0a1a]/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <button className="p-2.5 hover:bg-white/5 rounded-xl transition text-white/50 hover:text-white">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <button className="p-2.5 hover:bg-white/5 rounded-xl transition text-white/50 hover:text-white">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white hover:from-indigo-400 hover:to-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-white/20" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Your Messages</h2>
                <p className="text-white/50 mb-6 max-w-md">
                  Select a conversation to start chatting or find new users to connect with
                </p>
                <Link
                  href="/users"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-400 hover:to-purple-500 transition"
                >
                  <Users className="w-5 h-5" />
                  Find Users
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
