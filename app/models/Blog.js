const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa Schema cho Blog
const Blog = new Schema({
    name: { type: String, maxLength: 255 }, // Tiêu đề bài viết
    description: { type: String, maxLength: 600 }, // Mô tả ngắn
    image: { type: String, maxLength: 255 }, // Link hình ảnh
    slug: { type: String, maxLength: 255 }, // Đường dẫn URL thân thiện
    createdAt: { type: Date, default: Date.now }, // Tự động lưu thời gian tạo
    updatedAt: { type: Date, default: Date.now }  // Tự động lưu thời gian cập nhật
});

// Xuất Model có tên là 'Blog' để sử dụng ở Controller
module.exports = mongoose.model('Blog', Blog);