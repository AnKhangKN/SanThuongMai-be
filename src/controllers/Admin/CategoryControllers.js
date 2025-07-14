const CategoryServices = require('../../services/Admin/CategoryServices')

const getAllCategories = async (req, res) => {
    try {

        const user = req?.user?.id;
        if (!user) {
            return res.status(404).json({
                message: "No user found"
            })
        }

        const result = await CategoryServices.getAllCategories();
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const createCategory = async (req, res) => {
    try {
        const user = req?.user?.id;
        const {categoryName, description, vat, platformFee, typeFees} = req.body;

        if (!categoryName || !vat || !platformFee || !typeFees) {
            return res.status(400).json({
                message: "Invalid category"
            })
        }

        if (!user) {
            return res.status(404).json({
                message: "No user found"
            })
        }

        const result = CategoryServices.createCategory({
            categoryName, description, vat, platformFee, typeFees
        })
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        const user = req?.user?.id;
        const { categoryId, categoryName, description, vat, platformFee, typeFees, isActive } = req.body;

        if (!user) {
            return res.status(401).json({
                status: 401,
                message: "Người dùng không hợp lệ hoặc chưa đăng nhập",
            });
        }

        if (!categoryId) {
            return res.status(400).json({
                status: 400,
                message: "Thiếu categoryId",
            });
        }

        const result = await CategoryServices.updateCategory({
            categoryId,
            categoryName,
            description,
            vat,
            platformFee,
            typeFees,
            isActive,
        });

        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status || 500).json({
            status: error.status || 500,
            message: error.message || "Lỗi máy chủ",
        });
    }
};


module.exports = {
    getAllCategories,
    createCategory,
    updateCategory
}