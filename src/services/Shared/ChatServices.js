const Chat = require("../../models/Chat");
const User = require("../../models/User");
const Message = require("../../models/Message");
const { getIo } = require("../../utils/socket");
const mongoose = require("mongoose");

const sendMessage = async ({ senderId, receiverId, chatId, text }) => {
    let chat;

    // Nếu có chatId → dùng chat cũ
    if (chatId) {
        chat = await Chat.findById(chatId);
        if (!chat) throw new Error("Chat not found");
    } else {
        // Nếu không có chatId → cần receiverId
        if (!receiverId) throw new Error("Receiver ID is required to start chat");

        // Tìm hoặc tạo chat mới giữa 2 người
        chat = await Chat.findOne({
            members: { $all: [senderId, receiverId] },
        });

        if (!chat) {
            chat = await Chat.create({
                members: [senderId, receiverId],
            });
        }
    }

    // Tạo tin nhắn mới
    const newMessage = await Message.create({
        chatId: chat._id,
        senderId,
        text,
    });

    // Cập nhật thời gian hoạt động của đoạn chat
    chat.updatedAt = new Date();
    await chat.save();

    // 🔌 Gửi socket đến tất cả thành viên trong đoạn chat
    const io = getIo();

    if (!chat) {
        console.log("❌ Chat not found for ID:", chatId);
        return res.status(404).json({ message: "Chat not found" });
    }

    console.log("✅ Chat found:", chat);

    chat.members.forEach((memberId) => {
        console.log(`🔁 Emitting to member ${memberId}`);

        io.to(memberId.toString()).emit("receiveMessage", {
            _id: newMessage._id,
            chatId: chat._id,
            senderId,
            text: newMessage.text,
            createdAt: newMessage.createdAt,
        });
    });

    return {
        message: "Message sent successfully",
        data: newMessage,
        chatId: chat._id,
    };
};

// const getChats = async ({ userId }) => {
//     try {
//         const chats = await Chat.find({
//             members: { $in: [userId] }
//         }).lean();
//
//         // Tạo map: userId => chatId
//         const userIdToChatIdMap = {};
//
//         chats.forEach(chat => {
//             const otherId = chat.members.find(
//                 id => id.toString() !== userId.toString()
//             );
//             if (otherId) {
//                 userIdToChatIdMap[otherId.toString()] = chat._id.toString();
//             }
//         });
//
//         const uniqueUserIds = Object.keys(userIdToChatIdMap);
//
//         const users = await User.find({ _id: { $in: uniqueUserIds, $ne: userId } })
//             .select("_id fullName email")
//             .lean();
//
//         // Gắn chatId vào từng user
//         const usersWithChatId = users.map(user => ({
//             ...user,
//             chatId: userIdToChatIdMap[user._id.toString()]
//         }));
//
//         console.log(usersWithChatId);
//         return usersWithChatId;
//     } catch (error) {
//         console.error("❌ Lỗi khi lấy danh sách người đã chat:", error);
//         throw new Error("Không thể lấy danh sách người đã chat");
//     }
// };

const getChats = async ({ userId }) => {
    try {
        const ADMIN_ID = "6860059faead400715c4b4de";

        const chats = await Chat.find({
            members: { $in: [userId] }
        }).lean();

        const userIdToChatIdMap = {};

        chats.forEach(chat => {
            const otherId = chat.members.find(
                id => id.toString() !== userId.toString()
            );
            if (otherId) {
                userIdToChatIdMap[otherId.toString()] = chat._id.toString();
            }
        });

        const uniqueUserIds = new Set(Object.keys(userIdToChatIdMap));

        // Đảm bảo admin luôn có mặt
        if (ADMIN_ID !== userId.toString() && !uniqueUserIds.has(ADMIN_ID)) {
            uniqueUserIds.add(ADMIN_ID);
        }

        const users = await User.find({ _id: { $in: Array.from(uniqueUserIds) } })
            .select("_id fullName email")
            .lean();

        const usersWithChatId = users.map(user => ({
            ...user,
            chatId: userIdToChatIdMap[user._id.toString()] || null, // null nếu chưa có chat với admin
        }));

        return usersWithChatId;
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách người đã chat:", error);
        throw new Error("Không thể lấy danh sách người đã chat");
    }
};


const getMessagesHistory = ({ userId, receiverId }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !mongoose.Types.ObjectId.isValid(userId) ||
                !mongoose.Types.ObjectId.isValid(receiverId)
            ) {
                return reject(new Error("userId hoặc receiverId không hợp lệ"));
            }

            const userObjId = new mongoose.Types.ObjectId(userId);
            const receiverObjId = new mongoose.Types.ObjectId(receiverId);

            const chat = await Chat.findOne({
                members: { $all: [userObjId, receiverObjId] },
            });

            if (!chat) return resolve([]);

            const messages = await Message.find({
                chatId: chat._id,
            })
                .sort({ createdAt: 1 })
                .select("text senderId createdAt chatId") // chỉ lấy trường cần
                .lean();


            resolve(messages);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    sendMessage,
    getChats,
    getMessagesHistory
};
