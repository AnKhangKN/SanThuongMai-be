const Chat = require("../models/Chat");
const Message = require("../models/Message");

let io;

const initSocket = (server) => {
    const { Server } = require("socket.io");
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("🟢 Client connected");

        // Khi client kết nối, cho phép client gửi userId để join vào room cá nhân
        socket.on("setup", (userId) => {
            socket.join(userId); // Room riêng cho mỗi người dùng
            console.log(`👤 User ${userId} joined their personal room`);
        });

        /**
         * Khi người dùng mở khung chat, gọi sự kiện này để join vào room
         * - Nếu đã có chat → join room với chatId
         * - Nếu chưa có → tạo chat mới rồi join
         */
        socket.on("joinRoom", async ({ senderId, receiverId }) => {
            try {
                let chat = await Chat.findOne({
                    members: { $all: [senderId, receiverId] }
                });

                if (!chat) {
                    chat = await Chat.create({
                        members: [senderId, receiverId]
                    });
                }

                const chatId = chat._id.toString();

                socket.join(chatId);
                socket.emit("joinedRoom", { chatId });

                console.log(`✅ ${senderId} joined room ${chatId}`);
            } catch (error) {
                console.error("❌ Error in joinRoom:", error.message);
                socket.emit("error", { message: error.message });
            }
        });

        /**
         * Gửi tin nhắn
         * - Nếu chưa có chatId → tìm hoặc tạo chat
         * - Join vào room nếu chưa
         * - Tạo tin nhắn, gửi đến room
         */
        socket.on("sendMessage", async (data) => {
            try {
                const { senderId, receiverId, chatId, text } = data;

                if (!chatId) {
                    return res.status(400).json({
                        message: "Lỗi thêm tin nhắn"
                    })
                }

                socket.join(chatId);

                const message = await Message.create({
                    senderId,
                    chatId,
                    text
                });

                const messageData = {
                    chatId,
                    senderId,
                    receiverId,
                    text: message.text,
                };

                // Gửi cho 2 bên refresh danh sách chat
                io.to(senderId).emit("refreshChatList");
                io.to(receiverId).emit("refreshChatList");

                // Gửi message mới đến tất cả trong room
                io.to(chatId).emit("receiveMessage", messageData);

                console.log(`✉️ Message sent in room ${chatId}`);
            } catch (error) {
                console.error("❌ Error in sendMessage:", error.message);
                socket.emit("error", { message: error.message });
            }
        });

        socket.on("disconnect", () => {
            console.log("🔴 Client disconnected");
        });
    });
};

const getIo = () => {
    if (!io) throw new Error("Socket.IO not initialized");
    return io;
};

module.exports = {
    initSocket,
    getIo
};
