import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from './env';

let io: SocketIOServer;

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

        socket.on('disconnect', () => {
            console.log(`❌ User ${userId} disconnected`);
        });
    });

    console.log('🔌 WebSocket server initialized');
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
