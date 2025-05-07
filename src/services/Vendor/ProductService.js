const Product = require("../../models/Product");
const User = require("../../models/User");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        product_name,
        description,
        category,
        images,
        details = [],
        user_id,
        sale,
      } = newProduct;

      const {
        size = null,
        color = null,
        price = null,
        quantity = null,
      } = details[0] || {};

      const createdProduct = await Product.create({
        product_name,
        description,
        category,
        images,
        details: [{ size, color, price, quantity }],
        user_id,
        sale,
      });

      if (createdProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdProduct,
        });
      } else {
        reject(new Error("Không thể tạo sản phẩm"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productId = data._id;


      const checkId = await Product.findOne({ _id: productId });

      if (checkId === null) {
        return resolve({
          status: "ERR",
          message: "Product not found",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(productId, data, {
        new: true,
      });

      return resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkId = await User.findOne({
        _id: userId,
      });

      if (checkId === null) {
        resolve({
          status: "ERR",
          message: "User not found",
        });
      }

      const allProduct = await Product.find({
        user_id: userId,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getAllProduct,
};
