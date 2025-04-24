const Shop = require("../../models/Shop");
const ShopService = require("../../controllers/Admin/ShopControllers");

const getAllViolatedShops = () => {
    return new Promise((resolve, reject) => {
        try {

            if()
        }
        catch (err) {
            reject(err);
        }
    })
}

const partialUpdateShop = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const shop = await Shop.findOne({_id: id})
            if (!shop) {
                return reject({message: "Shop not found"});
            }

            const updatedShop = await Shop.findByIdAndUpdate(
                {_id: id},
                {$set: data},
                {new: true}
            );

            console.log(data);

            resolve({
                status: "success",
                message: "Shop successfully updated",
                data: updatedShop
            });
        } catch (err) {
            reject({message: err.message || "Internal Server Error"});
        }
    });
};

module.exports = {partialUpdateShop, getAllViolatedShops};
