const UserServices = require("../../services/Admin/UserServices");

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({
                status: "err",
                message: "Không tìm thấy  người dùng",
            });
        }

        // truyền vào
        const result = await UserServices.deleteUser(userId);

        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({
            message: e.message || "Internal Server Error",
        });
    }
};

const partialUpdateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;

        if (!userId) {
            return res.status(400).json({
                status: "ERROR",
                message: "Không có người dùng",
            });
        }

        // truyền vào
        const result = await UserServices.partialUpdateUser(userId, data);

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Internal Server Error",
        });
    }
};

const getAllUser = async (req, res) => {
    try {
        const result = await UserServices.getAllUser();

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: e.message || "Internal Server Error",
        });
    }
};


module.exports = {
    deleteUser,
    partialUpdateUser,
    getAllUser,
};
