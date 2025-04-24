const ShopServices = require("../../services/Admin/ShopServices");

const getAllViolatedShops = async (req, res) => {
    try {

        const data = req.body;

        const result = await ShopServices.getAllViolatedShops(data);


    } catch (err) {
        return res.status(400).send({

            status: "error",
            msg: "error",

        });
    }
}

const partialUpdateShop = async (req, res) => {
    try {
        const shopId = req.params.id;
        const data = req.body;

        if (!shopId) {
            return res.status(404).send({
                status: "error",
                error: "Shop not found"
            })
        }

        const result = await ShopServices.partialUpdateShop(shopId, data);

        return res.status(200).send(result);

    } catch (err) {
        return res.status(500).send({
            message: err.message || "Internal Server Error",
        })
    }
}

module.exports = {partialUpdateShop, getAllViolatedShops};