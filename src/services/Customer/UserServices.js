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

module.exports = {
    getDetailAccountUser,
    partialUpdateUser,
    addWishlist,
};
