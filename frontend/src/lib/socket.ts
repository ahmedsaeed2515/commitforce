import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            autoConnect: false,
            auth: {
                token: ''
            }
        });
    }
    return socket;
};

export const connectSocket = (token: string) => {
    const sock = getSocket();
    sock.auth = { token };
    sock.connect();
    console.log('🔌 WebSocket connected');
};

export const disconnectSocket = () => {
    const sock = getSocket();
    if (sock.connected) {
        sock.disconnect();
        console.log('🔌 WebSocket disconnected');
    }
};

export { socket };
