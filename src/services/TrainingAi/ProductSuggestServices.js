const axios = require("axios");

const productSuggest = async (productId) => {
    const limit = 2;

    try {
        const response = await axios.get(
            `http://localhost:5000/api/ai/recommender/${productId}?limit=${limit + 1}`
        );

        const data = response.data?.recommendations || [];

        return {
            message: "Lấy thành công danh sách!",
            data
        };
    } catch (error) {

        // Trả về danh sách rỗng
        return {
            message: "Không thể lấy danh sách gợi ý. Trả về danh sách rỗng.",
            data: []
        };
    }
};

module.exports = {
    productSuggest
};
