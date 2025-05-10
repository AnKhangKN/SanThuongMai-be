const Product = require("../../models/Product");
const User = require("../../models/User");
const path = require("path");

const createProduct = (newProduct, files, user_id) => {
  return new Promise(async (resolve, reject) => {
    try {

      const {
        product_name,
        category,
        description,
        size,
        color,
        price,
        quantity,
      } = newProduct;

      // Lưu đường dẫn hình ảnh vào mảng images

      const imageNames = files ? files.map((file) => file.filename) : [];

      // Tạo sản phẩm mới
      const createdProduct = await Product.create({
        product_name,
        category,
        description,
        images: imageNames,
        details: [
          {
            size: size || null,
            color: color || null,
            price: price || null,
            quantity: quantity || null,
          },
        ],
        user_id,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: createdProduct,
      });
    } catch (e) {
      reject(new Error(e.message || "Không thể tạo sản phẩm"));
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
