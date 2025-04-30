const Product = require("../../models/Product");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        product_name,
        description,
        category,
        images,
        details: {
          size = null,
          color = null,
          price = null,
          quantity = null,
        } = {},
        status,
        rating,
        sale,
        user_id,
      } = newProduct;

      const createdProduct = await Product.create({
        product_name,
        description,
        category,
        images,
        details: { size, color, price, quantity },
        status,
        rating,
        sale,
        user_id,
      });

      if (createProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (productId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkId = await Product.findOne({
        _id: productId,
      });

      if (checkId === null) {
        resolve({
          status: "ERR",
          message: "Product not found",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(productId, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
};
