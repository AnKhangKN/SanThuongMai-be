const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đường dẫn tuyệt đối tới thư mục uploads
const uploadsDir = path.join(__dirname, '../uploads');

// Tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình lưu trữ với Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);  // Đường dẫn lưu ảnh
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));  // Đặt tên file với phần mở rộng
    }
});

// Cấu hình Multer với giới hạn dung lượng và kiểm tra loại file
const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 },  // Giới hạn dung lượng file (1MB)
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;  // Kiểm tra định dạng ảnh
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Error: File upload chỉ hỗ trợ .jpeg, .jpg, .png'));
        }
    }
}).single('image');  // 'image' là tên trường file trong form (theo thẻ <input type="file" name="image" />)

module.exports = upload;
