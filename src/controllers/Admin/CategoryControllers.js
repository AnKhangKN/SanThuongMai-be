const Categories = require('../../services/Admin/CategoryServices')

const getAllCategories = async (req, res) => {
    try {

        const result = Categories.getAllCategories();
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

module.exports = {
    getAllCategories
}