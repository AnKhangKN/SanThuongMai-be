// utils/socket.js
let io;

const initSocket = (server) => {
    const { Server } = require("socket.io");
    io = new Server(server, {
        cors: {
            origin: "*", // phải khớp với FE của bạn localhost là: http://localhost:3000
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

        socket.on('sendMessage', async ({ senderId, receiverId, chatId, text }) => {
            let finalChatId = chatId;

            // Nếu không có chatId → tạo hoặc lấy chatId giữa 2 người
            if (!finalChatId && receiverId) {
                const Chat = require("../models/Chat"); // tùy đường dẫn

                // Tìm chat giữa 2 người (dù thứ tự đảo ngược)
                let chat = await Chat.findOne({
                    members: { $all: [senderId, receiverId], $size: 2 }
                });

                if (!chat) {
                    // Chưa có → tạo mới
                    chat = await Chat.create({
                        members: [senderId, receiverId],
                        createdAt: new Date(),
                    });
                }

                finalChatId = chat._id.toString();

                // Cho socket join room mới
                socket.join(finalChatId);

                socket.emit("messageSent", { senderId, receiverId });
                socket.emit("messageSent", { senderId, receiverId });

                console.log(`🆕 Tạo hoặc dùng chatId ${finalChatId} giữa ${senderId} & ${receiverId}`);
            }

            if (!finalChatId) {
                console.warn("Không thể gửi tin nhắn vì thiếu chatId hoặc receiverId.");
                return;
            }

            // Gửi đến room
            socket.to(finalChatId).emit("receiveMessage", {
                senderId,
                text,
                chatId: finalChatId,
            });

            socket.emit("messageSent", { senderId, receiverId });
            socket.emit("messageSent", { senderId, receiverId });

            console.log(`📤 Message from ${senderId} to chat ${finalChatId}: ${text}`);
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
