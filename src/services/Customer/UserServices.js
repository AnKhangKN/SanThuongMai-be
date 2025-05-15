const User = require("../../models/User");

const getDetailAccountUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detailUser = await User.findOne({_id: userId});


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
            const checkUser = await User.findOne({_id: id});

            if (!checkUser) {
                return reject({
                    status: "ERROR",
                    message: "Không tìm thấy người dùng",
                });
            }

            console.log(data.payload)

            const updatedUser = await User.findOneAndUpdate(
                {_id: id},
                {user_name: data?.payload},
                {new: true}
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

const addWishlist = async (id, shop) => {
    const user = await User.findOne({_id: id});
    if (!user) {
        throw new Error("Người dùng không tồn tại!");
    }

    const { owner_id, shop_name } = shop;

    // Kiểm tra nếu shop đã có trong wishlist
    const exists = user.wishlist.some(
        (item) => item.shop_name === shop_name && item.owner_id === owner_id
    );

    const owner_shop = await User.findOne({_id: owner_id});

    const owner_img = owner_shop.images;

    if (!exists) {
        user.wishlist.push({
            owner_id: owner_id,
            shop_name: shop_name,
            owner_img: owner_img,

        });

        user.following = (user.following || 0) + 1;

        // Đảm bảo owner_shop tồn tại và có thuộc tính shop
        if (owner_shop && owner_shop.shop) {
            owner_shop.shop.followers = (owner_shop.shop.followers || 0) + 1;
            await owner_shop.save(); // Lưu lại thay đổi vào database
        }
        await user.save();
    }

    return {
        status: "OK",
        message: exists ? "Shop đã có trong wishlist" : "Thêm thành công",
        data: user.wishlist,
    };
};

const removeWishlist = (userId, wishlistId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy thông tin user
            const user = await User.findOne({ _id: userId });

            if (!user) {
                return reject("User không tồn tại.");
            }

            // Lấy thông tin wishlist cụ thể
            const wishlistItem = user.wishlist.find(
                (item) => item._id.toString() === wishlistId.wishlistId
            );

            if (!wishlistItem) {
                return reject("Wishlist không tồn tại trong danh sách của người dùng.");
            }

            // Xóa wishlist khỏi danh sách của user
            await User.findOneAndUpdate(
                { _id: userId },
                { $pull: { wishlist: { _id: wishlistId.wishlistId } }, $inc: { following: -1 } },
                { new: true }
            );

            // Giảm số lượng followers của vendor nếu tồn tại
            if (wishlistItem.owner_id) {
                await User.findOneAndUpdate(
                    { _id: wishlistItem.owner_id },
                    { $inc: { "shop.followers": -1 } },
                    { new: true }
                );
            }

            resolve({
                status: "OK",
                message: "Wishlist đã được xóa thành công.",
                data: wishlistItem,
            });
        } catch (error) {
            console.error("Lỗi khi xóa wishlist:", error);
            reject(error);
        }
    });
};

module.exports = {
    getDetailAccountUser,
    partialUpdateUser,
    addWishlist,
    removeWishlist
};
