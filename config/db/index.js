const mongoose = require('mongoose');

// Tạo một hàm kết nối bất đồng bộ (async/await) để đảm bảo kết nối xong mới chạy tiếp
async function connect(){
    try {
        // Chuỗi kết nối trỏ tới máy chủ cục bộ và Database đã tạo ở Buổi 08
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối Database thành công!');
    } catch (error) {
        console.log('❌ Kết nối Database thất bại!');
        console.log(error);
    }
}

// Xuất hàm connect ra ngoài
module.exports = { connect };