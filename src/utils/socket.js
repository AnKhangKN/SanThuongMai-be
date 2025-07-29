// utils/socket.js
let io;

const initSocket = (server) => {
    const { Server } = require("socket.io");
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000", // phải khớp với FE của bạn
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('🔌 A user connected');

        socket.on('joinRoom', (userId) => {
            socket.join(userId); // room tên là userId
            console.log(`🟢 User joined room: ${userId}`);
        });

        socket.on('sendMessage', ({ senderId, receiverId, text }) => {
            console.log(`📤 Message from ${senderId} to ${receiverId}: ${text}`);

            // Gửi tới người nhận theo room
            socket.to(receiverId).emit('receiveMessage', {
                senderId,
                text,
            });
        });
    });

};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = {
    initSocket,
    getIo,
};
