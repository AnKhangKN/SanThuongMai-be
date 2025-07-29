const GenerateLogServices = require("../../services/TrainingAi/GenerateLogServices");

const addProductViewLog = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.body;

        await GenerateLogServices.addProductViewLog({ userId, productId });

        // Không trả về dữ liệu, chỉ báo đã nhận
        res.status(204).end(); // 204 No Content
    } catch (error) {
        console.error("Lỗi ghi log:", error);
        res.status(500).json({ message: "Không ghi được log" });
    }
};

const addSearchKeyLog = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { keyword } = req.body;

        await GenerateLogServices.addSearchKeyLog({ userId, keyword });
        res.status(204).end();
    } catch (error) {
        console.error("Lỗi ghi log:", error);
        res.status(500).json({ message: "Không ghi được log" });
    }
}

module.exports = {
    addProductViewLog,
    addSearchKeyLog
};
