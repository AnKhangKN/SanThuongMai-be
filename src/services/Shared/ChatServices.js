const Chat = require("../../models/Chat");
const User = require("../../models/User");
const Message = require("../../models/Message");

const sendMessage = async ({ senderId, receiverId, chatId, text }) => {
    return ({ senderId, receiverId, chatId, text });
};

const getChats = async ({userId}) => {
    try {
        const ADMIN_ID = "6860059faead400715c4b4de";

        const chats = await Chat.find({
            members: {$in: [userId]}
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
        if (ADMIN_ID !== userId.toString()) {
            uniqueUserIds.add(ADMIN_ID);
        }

        // Lấy thông tin người dùng
        const users = await User.find({_id: {$in: Array.from(uniqueUserIds)}})
            .select("_id fullName email")
            .lean();

        // Ghép với chatId
        const usersWithChatId = users.map(user => ({
            ...user,
            chatId: userIdToChatIdMap[user._id.toString()] || null, // null nếu chưa từng chat
        }));

        return usersWithChatId;
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách người đã chat:", error);
        throw new Error("Không thể lấy danh sách người đã chat");
    }
};

const getMessagesHistory = ({userId, chatId}) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                return reject("User ID is required");
            }

            const chat = await Chat.findById(chatId); // Sửa lỗi ở đây

            if (!chat) return resolve([]); // không có chat thì trả về rỗng

            const messages = await Message.find({
                chatId: chat._id,
            })
                .sort({createdAt: 1})
                .select("text senderId createdAt chatId") // chỉ lấy các trường cần thiết
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
    getMessagesHistory,
};
