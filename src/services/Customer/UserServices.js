const Shop = require("../../models/Shop");
const User = require("../../models/User");
const bcrypt = require("bcrypt");

const getDetailAccountUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const detailUser = await User.findOne({ _id: userId });

      if (!detailUser) {
        return reject({
          status: "ERROR",
          message: "Không tìm thấy người dùng",
        });
      }

      resolve({
        status: "OK",
        message: "Lấy thông tin thành công",
        data: detailUser,
      });
    } catch (error) {
      reject({
        status: "ERROR",
        message: error.message || "Lỗi khi truy vấn dữ liệu người dùng",
      });
    }
  });
};

const partialUpdateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (!checkUser) {
        return reject({
          status: "ERROR",
          message: "Không tìm thấy người dùng",
        });
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { fullName: data?.payload },
        { new: true }
      );

      resolve({
        status: "OK",
        message: "Cập nhật thành công",
        data: updatedUser,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const addWishlist = async (id, shopInput) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new Error("Người dùng không tồn tại!");
  }

  const { shopId, shopName, images } = shopInput;

  // Kiểm tra nếu shop đã có trong wishShops
  const exists = user.wishShops.some(
    (item) =>
      item.shopId.toString() === shopId.toString() && item.shopName === shopName
  );

  const shop = await Shop.findOne({ _id: shopId });
  if (!shop) {
    throw new Error("Shop không tồn tại!");
  }

  if (!exists) {
    user.wishShops.push({
      shopId,
      shopName,
      images,
    });

    shop.followers = (shop.followers || 0) + 1;
    await shop.save();
    await user.save();
  }

  return {
    status: "OK",
    message: exists ? "Shop đã có trong wishlist" : "Thêm thành công",
    data: user.wishShops, // sửa lại cho đúng trường trong user
  };
};

const removeWishlist = (userId, shopId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);

      if (!user) return reject("User không tồn tại.");

      const shopItem = user.wishShops.find(
        (item) => item.shopId.toString() === shopId.toString()
      );

      if (!shopItem)
        return reject("Shop không tồn tại trong danh sách của người dùng.");

      // Xóa wishlist
      await User.findByIdAndUpdate(userId, {
        $pull: { wishShops: { shopId: shopId } },
      });

      // Giảm followers của shop
      const shop = await Shop.findById(shopId);
      if (shop && shop.followers > 0) {
        await Shop.findByIdAndUpdate(shopId, { $inc: { followers: -1 } });
      }

      resolve({
        status: "OK",
        message: "Wishlist đã được xóa thành công.",
        data: shopItem,
      });
    } catch (error) {
      console.error("Lỗi khi xóa wishlist:", error);
      reject(error);
    }
  });
};

const changePassword = async (id, password, newPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return reject({
          status: "FAIL",
          message: "Người dùng không tồn tại",
        });
      }

      // Kiểm tra mật khẩu hiện tại
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return reject({
          status: "ERROR",
          message: "Mật khẩu cũ không đúng",
        });
      }

      // So sánh mật khẩu mới với mật khẩu hiện tại
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return reject({
          status: "ERROR",
          message: "Mật khẩu mới không được giống mật khẩu hiện tại",
        });
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu mới
      user.password = hashedPassword;
      await user.save();

      resolve({
        status: "OK",
        message: "Đổi mật khẩu thành công",
      });
    } catch (error) {
      reject({
        status: "FAIL",
        message: "Đã xảy ra lỗi",
        error: error.message,
      });
    }
  });
};

module.exports = {
  getDetailAccountUser,
  partialUpdateUser,
  addWishlist,
  removeWishlist,
  changePassword,
};
