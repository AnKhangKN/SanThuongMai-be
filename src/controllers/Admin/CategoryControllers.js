const CategoryServices = require('../../services/Admin/CategoryServices')

const getAllCategories = async (req, res) => {
    try {

        const user = req?.user?.id;

        if (!user) {
            return res.status(404).json({
                message: "No user found"
            })
        }

        const result = CategoryServices.getAllCategories();
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

const createCategory = async (req, res) => {
    try {
        // const user = req?.user?.id;
        const {categoryName, description, vat, platformFee, typeFees} = req.body;

        if (!categoryName || !vat || !platformFee || !typeFees) {
            return res.status(400).json({
                message: "Invalid category"
            })
        }

        // if (!user) {
        //     return res.status(404).json({
        //         message: "No user found"
        //     })
        // }

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

module.exports = {
    getAllCategories,
    createCategory,
}