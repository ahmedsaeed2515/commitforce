'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/store/authStore';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  createdAt: string;
  read: boolean;
}

interface TypingUser {
  userId: string;
  isTyping: boolean;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    // Get token from storage
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (!isAuthenticated || !token) {
      return;
    }

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('🔌 Connected to WebSocket');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from WebSocket');
      setIsConnected(false);
    });

    socket.on('user:online', ({ userId, online }: { userId: string; online: boolean }) => {
      setOnlineUsers(prev => {
        if (online) {
          return [...new Set([...prev, userId])];
        }
        return prev.filter(id => id !== userId);
      });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  return {
    socket: socketRef.current,
    isConnected,
    onlineUsers,
  };
}

export function useChat(conversationId?: string) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    // Join conversation room
    socket.emit('chat:join', conversationId);

    // Listen for new messages
    socket.on('chat:newMessage', (data: { conversationId: string; message: Message }) => {
      if (data.conversationId === conversationId) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    // Listen for typing indicators
    socket.on('chat:userTyping', (data: TypingUser) => {
      setTypingUsers(prev => {
        if (data.isTyping) {
          return [...prev.filter(u => u.userId !== data.userId), data];
        }
        return prev.filter(u => u.userId !== data.userId);
      });
    });

    // Listen for read receipts
    socket.on('chat:messagesRead', (data: { userId: string; messageIds: string[] }) => {
      setMessages(prev => prev.map(msg => 
        data.messageIds.includes(msg.id) ? { ...msg, read: true } : msg
      ));
    });

    return () => {
      socket.emit('chat:leave', conversationId);
      socket.off('chat:newMessage');
      socket.off('chat:userTyping');
      socket.off('chat:messagesRead');
    };
  }, [socket, conversationId]);

  const sendMessage = useCallback((recipientId: string, content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!socket || !conversationId) return;

    socket.emit('chat:message', {
      conversationId,
      recipientId,
      content,
      type,
    });
  }, [socket, conversationId]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!socket || !conversationId) return;

    socket.emit('chat:typing', { conversationId, isTyping });
  }, [socket, conversationId]);

  const markAsRead = useCallback((messageIds: string[]) => {
    if (!socket || !conversationId) return;

    socket.emit('chat:markRead', { conversationId, messageIds });
  }, [socket, conversationId]);

  return {
    messages,
    typingUsers,
    sendMessage,
    sendTyping,
    markAsRead,
    isConnected,
  };
}

export function useNotifications() {
  const { socket, isConnected } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    socket.emit('notifications:subscribe');

    socket.on('notification:new', () => {
      setUnreadCount(prev => prev + 1);
    });

    socket.on('notification:message', (data: { type: string; senderId: string; preview: string }) => {
      // Show toast or notification
      console.log('New message notification:', data);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off('notification:new');
      socket.off('notification:message');
    };
  }, [socket]);

  const clearUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return {
    unreadCount,
    clearUnread,
    isConnected,
  };
}

export function useChallengeUpdates(challengeId?: string) {
  const { socket, isConnected } = useSocket();
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (!socket || !challengeId) return;

    socket.emit('challenge:join', challengeId);

    socket.on('challenge:update', (data: any) => {
      setUpdates(prev => [...prev, data]);
    });

    socket.on('challenge:checkin', (data: any) => {
      setUpdates(prev => [...prev, { type: 'checkin', ...data }]);
    });

    return () => {
      socket.emit('challenge:leave', challengeId);
      socket.off('challenge:update');
      socket.off('challenge:checkin');
    };
  }, [socket, challengeId]);

  return {
    updates,
    isConnected,
  };
}
