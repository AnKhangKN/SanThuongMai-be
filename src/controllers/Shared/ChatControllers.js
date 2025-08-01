const ChatServices = require("../../services/Shared/ChatServices");

const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id; // user đăng nhập là người gửi
        const { chatId, receiverId, text } = req.body;

        if (!senderId) {
            return res.status(400).json({
                message: "Không có người gữi"
            })
        }

        if (!text) {
            return res.status(400).json({ message: "Message text is required" });
        }

        const result = await ChatServices.sendMessage({
            senderId,
            receiverId,
            chatId,
            text,
        });

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error.message || "Internal Server Error",
        });
    }
};

const getChats = async (req, res) => {
    try {
        const userId = req.user?.id;
        const result = await ChatServices.getChats({ userId }); // Sửa chỗ này
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error.message || "Internal Server Error",
        });
    }
};

const getMessagesHistory = async (req, res) => {
    try {

        const userId = req.user?.id;
        const chatId = req.query.receiverId.chatId;

        const result = await ChatServices.getMessagesHistory({ userId, chatId });
        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({
            message: error.message || "Internal Server Error",
        })
    }
}

module.exports = {
    sendMessage,
    getChats,
    getMessagesHistory,
};
