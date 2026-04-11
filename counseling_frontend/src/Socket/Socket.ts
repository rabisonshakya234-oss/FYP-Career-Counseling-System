import { io, Socket } from "socket.io-client";

// Backend URL
const Socket_URL = "http://localhost:3000";

// Creating a Socket.IO client instance
export const socket : Socket = io(Socket_URL, {
    autoConnect: false, // we connect it manually later
    transports: ["websocket"], // Use WebSocket for connection
})