const Product = require("../../models/Product");
const User = require("../../models/User");
const path = require("path");

const createProduct = (newProduct, files, user_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { product_name, category, description, details, status, sale } =
        newProduct;

      const imageNames = files ? files.map((file) => file.filename) : [];

      const createdProduct = await Product.create({
        product_name,
        category,
        description: description || "",
        images: imageNames,
        details: Array.isArray(details) ? details : [],
        status: status || "active",
        sale: sale || {},
        rating: 0,
        user_id,
        banned_until: null,
        reports: [],
        sold_count: 0,
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

const updateStatusProduct = (data, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productId = userId;

      const checkId = await Product.findOne({ _id: productId });

      if (checkId === null) {
        return resolve({
          status: "ERR",
          message: "Product not found",
        });
      }

      const updatedStatusProduct = await Product.findByIdAndUpdate(
        productId,
        data,
        {
          new: true,
        }
      );

      return resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedStatusProduct,
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
  updateStatusProduct,
};
