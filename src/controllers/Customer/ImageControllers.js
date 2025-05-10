const upload = require('../../middleware/multerConfigAvatar');  // Cấu hình multer
const imageService = require('../../services/Customer/ImageServices');  // Dịch vụ lưu đường dẫn ảnh vào DB

// Controller xử lý upload
const uploadImage = (req, res) => {
    // Sử dụng multer để xử lý upload
    upload(req, res, async (error) => {
        if (error) {
            return res.status(400).send({
                error: error,
                message: "Please upload a valid image"
            });
        }

        // Sau khi upload thành công, bạn có thể truy cập thông tin file trong req.file
        console.log('Uploaded file:', req.file);

        // Giả sử bạn có thông tin user trong req.user hoặc token để lấy userId
        const userId = req.user.id;  // Lấy userId từ JWT hoặc session

        try {
            // Tạo đường dẫn đầy đủ tới ảnh
            const imagePath = `../uploads/avatar${req.file.filename}`;  // Đường dẫn ảnh sau khi tải lên

            // Lưu đường dẫn ảnh vào MongoDB thông qua service
            const user = await imageService.saveImagePathToDB(userId, imagePath);
            return res.status(200).send({
                message: "Image uploaded and saved to MongoDB successfully",
                imageName: req.file.filename,  // Trả về tên file
                imageUrl: imagePath  // Trả về đường dẫn ảnh
            });
        } catch (error) {
            console.error("Error saving image path to DB:", error);
            return res.status(500).send({
                message: "Error saving image path to MongoDB"
            });
        }
    });
};

module.exports = {
    uploadImage
};
