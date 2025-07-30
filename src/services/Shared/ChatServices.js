const Chat = require("../../models/Chat");
const User = require("../../models/User");
const Message = require("../../models/Message");
const { getIo } = require("../../utils/socket");

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

const getMessagesHistory = ({ userId, chatId }) => {
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
                .sort({ createdAt: 1 })
                .select("text senderId createdAt chatId") // chỉ lấy các trường cần thiết
                .lean();
            
            console.log(messages);
            

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
