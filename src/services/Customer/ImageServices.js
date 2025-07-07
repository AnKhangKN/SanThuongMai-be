const User = require('../../models/User');  // Import model User
const path = require('path');  // Import path module
const fs = require('fs');  // Import fs module (File System)

const uploadsDir = path.join(__dirname, '../uploads/avatar/');  // Đường dẫn tới thư mục uploads/avatar

// Hàm lưu tên file ảnh vào MongoDB và xóa ảnh cũ nếu có
const saveImagePathToDB = async (userId, imagePath) => {
    try {
        // Chỉ lấy tên file từ đường dẫn ảnh
        let fileName = path.basename(imagePath);  // Lấy tên file từ đường dẫn

        // Tìm User theo userId để lấy ảnh cũ
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Kiểm tra nếu user có ảnh cũ, xóa ảnh cũ nếu tồn tại
        if (user.avatar) {
            const oldFilePath = path.join(uploadsDir, user.avatar);  // Đường dẫn file cũ với thư mục avatar
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);  // Xóa ảnh cũ
            }
        }

        // Cập nhật ảnh mới vào MongoDB (chỉ lưu tên file ảnh)
        user.avatar = fileName;  // Lưu tên file vào MongoDB (chỉ có tên file không có thư mục)
        await user.save();

        return user;
    } catch (error) {
        console.error(error);
        throw new Error('Error saving image path to MongoDB');
    }
};

module.exports = {
    saveImagePathToDB
};
