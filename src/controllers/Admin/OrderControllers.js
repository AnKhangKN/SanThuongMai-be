const OrderServices = require("../../services/Admin/OrderServices");

const getAllOrder = async (req, res) => {
    try {

        const userId = req.user.id;

        if (!userId) {
            return res.status(404).send({
                message: "User not found"
            })
        }

        const result = await OrderServices.getAllOrder()
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).send({
            message: error.message || "Internal Server Error",
        })
    }
}

const setStatusOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(404).send({
                message: "User not found"
            })
        }

        const data = req.body;

        const result = await OrderServices.setStatusOrder(userId, data)

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).send({
            message: error.message || "Internal Server Error",
        })
    }
}

module.exports = {
    getAllOrder,
    setStatusOrder
}