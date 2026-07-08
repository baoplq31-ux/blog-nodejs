const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <h1>Chào mừng đến với trang web của tôi!</h1>
    <p>Đây là trang chủ của ứng dụng Node.js sử dụng Express.</p>
    <a href="/gioi-thieu">Trang giới thiệu</a>
  `); 
});

app.get("/gioi-thieu", (req, res) => {
    res.send(`
        <h1>Thông tin cá nhân</h1>
        <p><strong>Họ và tên:</strong> Phan Lê Quốc Bảo</p>
        <p><strong>Mã sinh viên:</strong> 2606042019</p>
        <p><strong>Lớp:</strong> CNTT 20THL</p>
        <a href="/">Quay lại trang chủ</a>
    `);
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});