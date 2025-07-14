const HomeServices = require("../../services/Admin/HomeServices");

const getAllHome = async (req, res) => {
    try {
        const user_id = req.user?.id;

        if (!user_id) {
            return res.status(404).json({
                error: "User id not found",
            });
        }

        const result = await HomeServices.getAllHome();

        return res.status(200).json(result); // Đảm bảo trả về JSON
    } catch (error) {
        console.error("Lỗi khi gọi API getAllHome:", error); // Log chi tiết lỗi cho server
        return res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message, // Thêm thông tin lỗi
        });
    }
};

module.exports = {
    getAllHome,
};
