import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from './env';

let io: SocketIOServer;

// Store online users
const onlineUsers = new Map<string, string>(); // Map userId to socketId

export const initializeSocket = (httpServer: HTTPServer) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: config.FRONTEND_URL,
            credentials: true
        }
    });

    // Authentication middleware
    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth.token;
        
        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
            (socket as any).userId = decoded.id;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket: Socket) => {
        const userId = (socket as any).userId;
        console.log(`✅ User ${userId} connected via WebSocket`);

        // Join user's personal room
        socket.join(`user:${userId}`);
        
        // Mark user as online
        onlineUsers.set(userId, socket.id);
        io.emit('user:online', { userId, online: true });

        // ============ CHAT EVENTS ============
        
        // Join a conversation room
        socket.on('chat:join', (conversationId: string) => {
            socket.join(`conversation:${conversationId}`);
            console.log(`User ${userId} joined conversation ${conversationId}`);
        });

        // Leave a conversation room
        socket.on('chat:leave', (conversationId: string) => {
            socket.leave(`conversation:${conversationId}`);
            console.log(`User ${userId} left conversation ${conversationId}`);
        });

        // Send a message
        socket.on('chat:message', async (data: {
            conversationId: string;
            recipientId: string;
            content: string;
            type?: 'text' | 'image' | 'file';
        }) => {
            const message = {
                id: Date.now().toString(),
                senderId: userId,
                content: data.content,
                type: data.type || 'text',
                createdAt: new Date().toISOString(),
                read: false,
            };

            // Emit to conversation room
            io.to(`conversation:${data.conversationId}`).emit('chat:newMessage', {
                conversationId: data.conversationId,
                message,
            });

            // Emit notification to recipient if they're in a different room
            io.to(`user:${data.recipientId}`).emit('notification:message', {
                type: 'new_message',
                senderId: userId,
                preview: data.content.substring(0, 50),
                conversationId: data.conversationId,
            });
        });

        // User is typing
        socket.on('chat:typing', (data: { conversationId: string; isTyping: boolean }) => {
            socket.to(`conversation:${data.conversationId}`).emit('chat:userTyping', {
                userId,
                isTyping: data.isTyping,
            });
        });

        // Mark messages as read
        socket.on('chat:markRead', (data: { conversationId: string; messageIds: string[] }) => {
            io.to(`conversation:${data.conversationId}`).emit('chat:messagesRead', {
                userId,
                messageIds: data.messageIds,
            });
        });

        // ============ NOTIFICATION EVENTS ============
        
        // Subscribe to notification updates
        socket.on('notifications:subscribe', () => {
            console.log(`User ${userId} subscribed to notifications`);
        });

        // ============ CHALLENGE EVENTS ============
        
        // Join a challenge room for live updates
        socket.on('challenge:join', (challengeId: string) => {
            socket.join(`challenge:${challengeId}`);
            console.log(`User ${userId} watching challenge ${challengeId}`);
        });

        socket.on('challenge:leave', (challengeId: string) => {
            socket.leave(`challenge:${challengeId}`);
        });

        // ============ CLUB EVENTS ============
        
        socket.on('club:join', (clubId: string) => {
            socket.join(`club:${clubId}`);
        });

        socket.on('club:leave', (clubId: string) => {
            socket.leave(`club:${clubId}`);
        });

        // ============ DISCONNECT ============
        
        socket.on('disconnect', () => {
            console.log(`❌ User ${userId} disconnected`);
            onlineUsers.delete(userId);
            io.emit('user:online', { userId, online: false });
        });
    });

    console.log('🔌 WebSocket server initialized with chat support');
    return io;
};

export const getIO = (): SocketIOServer => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

// Emit notification to specific user
export const emitToUser = (userId: string, event: string, data: any) => {
    if (io) {
        io.to(`user:${userId}`).emit(event, data);
    }
};

// Emit to all users
export const emitToAll = (event: string, data: any) => {
    if (io) {
        io.emit(event, data);
    }
};

// Emit to a conversation
export const emitToConversation = (conversationId: string, event: string, data: any) => {
    if (io) {
        io.to(`conversation:${conversationId}`).emit(event, data);
    }
};

// Emit to a challenge room
export const emitToChallenge = (challengeId: string, event: string, data: any) => {
    if (io) {
        io.to(`challenge:${challengeId}`).emit(event, data);
    }
};

// Emit to a club room
export const emitToClub = (clubId: string, event: string, data: any) => {
    if (io) {
        io.to(`club:${clubId}`).emit(event, data);
    }
};

// Check if user is online
export const isUserOnline = (userId: string): boolean => {
    return onlineUsers.has(userId);
};

// Get all online users
export const getOnlineUsers = (): string[] => {
    return Array.from(onlineUsers.keys());
};
