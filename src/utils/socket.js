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

    // Tạo connection
    io.on('connection', (socket) => {
        console.log('🔌 A user connected');
        // Join rooms chat theo chatId.
        socket.on('joinRooms', ({ userId, chatIds }) => {
            console.log(`🟢 User ${userId} joining chats:`, chatIds)
            
            chatIds.forEach((chatId) => {
                socket.join(chatId); // mỗi room là 1 đoạn chat
            });
        });

        // Gửi tin nhắn socket sendMessages (gửi vào chatId không phân biệt ai ai trong đoạn chat đều nhận)
        socket.on('sendMessage', ({ senderId, chatId, text }) => {
            console.log(`📤 Message from ${senderId} to chat ${chatId}: ${text}`);

            // Gửi đến tất cả thành viên trong room (trừ người gửi)
            socket.to(chatId).emit('receiveMessage', {
                senderId,
                text,
                chatId,
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
