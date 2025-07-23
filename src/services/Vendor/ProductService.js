const Product = require("../../models/Product");
const Shop = require("../../models/Shop");
const path = require("path");

const createProduct = (newProduct, files, user_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        productName,
        categoryId,
        description,
        priceOptions,
        status,
        sale,
        shopId,
      } = newProduct;

      const imageNames = files ? files.map((file) => file.filename) : [];
      const createdProduct = await Product.create({
        productName,
        categoryId,
        description: description || "",
        images: imageNames,
        priceOptions,
        status: status || "active",
        sale: sale || {},
        shopId,
        bannedUntil: null,
        reports: [],
        soldCount: 0,
        numRating: 0,
        followers: 0,
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

const updateProduct = (productId, updatedData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!productId) {
        return resolve({
          status: "ERR",
          message: "Invalid product ID",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updatedData,
        { new: true }
      );

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

const getAllProductByVendor = (vendorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkId = await Shop.findOne({ ownerId: vendorId });

      if (checkId === null) {
        return resolve({
          status: "ERR",
          message: "Người dùng không tồn tại",
        });
      }
      const producted = await Product.find({ shopId: checkId._id });
      return resolve({
        status: "OK",
        message: "SUCCESS",
        data: producted,
      });
    } catch (e) {
      return reject(e);
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

const searchProductsByName = (vendorId, keyword) => {
  return new Promise(async (resolve, reject) => {
    try {
      const products = await Product.find({
        shopId: vendorId,
        productName: { $regex: keyword, $options: "i" },
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: products,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getAllProductByVendor,
  updateStatusProduct,
  searchProductsByName,
};
