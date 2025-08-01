const axios = require("axios");
const ProductSuggestService = require("../../services/TrainingAi/ProductSuggestServices")

const productSuggest = async (req, res) => {
    try {
        const productId = req.params.productId;

        const result = await ProductSuggestService.productSuggest(productId);
        return  res.status(200).json(result);
    } catch (error) {
        return res.status(404).json("Not Found!");
    }
}

module.exports = {
    productSuggest,
};