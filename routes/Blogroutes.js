const express = require('express');
const router = express.Router();
const blogController = require('../app/controllers/BlogController');
const { requireAdmin } = require('../app/middleware/auth');

// Route công khai cho người dùng
router.get('/recipes', blogController.recipes);

// Route admin quản trị phải có quyền admin
router.get('/create', requireAdmin, blogController.create);
router.post('/store', requireAdmin, blogController.store);
router.get('/my-blogs', requireAdmin, blogController.myBlogs);
router.get('/:id/edit', requireAdmin, blogController.edit);
router.put('/:id', requireAdmin, blogController.update);
router.delete('/:id', requireAdmin, blogController.destroy);

// Route xem chi tiết động luôn để dưới cùng
router.get('/:slug', blogController.show);

module.exports = router;