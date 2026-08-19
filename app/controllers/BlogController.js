const Blog = require('../models/Blog');
class BlogController {
    // [POST] /blogs/store (Xử lý dữ liệu)
    store(req, res, next) {
        // Lấy dữ liệu người dùng nhập từ req.body
        const formData = req.body;
        formData.category = formData.category || 'Món mặn';

        // Khởi tạo một đối tượng Blog mới dựa trên dữ liệu form
        const blog = new Blog(formData);

        // Lưu vào Database
        blog.save()
            .then(() => {
                // Lưu thành công thì tự động chuyển hướng về Trang chủ
                res.redirect('/');
            })
            .catch(error => {
                // Báo lỗi nếu lưu thất bại
                next(error);
            });
    }

    recipes(req, res, next) {
        const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
        const limit = 6;
        const category = req.query.category || '';
        const query = category === 'Món mặn'
            ? { $or: [{ category: 'Món mặn' }, { category: { $exists: false } }] }
            : (category ? { category } : {});

        Promise.all([
            Blog.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            Blog.countDocuments(query)
        ])
            .then(([blogs, total]) => {
                res.render('recipes', {
                    blogs,
                    category,
                    pagination: { page, totalPages: Math.ceil(total / limit), hasPrevious: page > 1, hasNext: page * limit < total, previousPage: page - 1, nextPage: page + 1 }
                });
            })
            .catch(next);
    }

    myBlogs(req, res, next) {
        const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
        const limit = 10;

        Promise.all([
            Blog.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            Blog.countDocuments({})
        ])
        .then(([blogs, total]) => {
            res.render('my-blogs', {
                blogs,
                isAdmin: true,
                pagination: { page, totalPages: Math.ceil(total / limit), hasPrevious: page > 1, hasNext: page * limit < total, previousPage: page - 1, nextPage: page + 1 }
            });
        })
        .catch(next);
    }

        // [GET] /blogs/:id/edit
    edit(req, res, next) {
        // Tìm bài viết theo ID lấy từ URL
        Blog.findById(req.params.id).lean()
            .then(blog => res.render('edit', { blog: blog }))
            .catch(next);
    }

        // [PUT] /blogs/:id
    update(req, res, next) {
        const updatedData = {
            ...req.body,
            category: req.body.category || 'Món mặn',
            updatedAt: new Date()
        };

        Blog.updateOne({ _id: req.params.id }, updatedData)
            .then(() => res.redirect('/blogs/my-blogs'))
            .catch(next);
    }

        // [DELETE] /blogs/:id
    destroy(req, res, next) {
        Blog.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back')) // Xóa xong tải lại trang hiện tại
            .catch(next);
    }
    
    index(req, res) {
        res.render('home');
    }

    // [GET] /blogs/create (Hiển thị form)
    create(req, res, next) {
        res.render('create');
    }
    
    // [GET] /blogs/:slug
    show(req, res, next) {
        // req.params.slug sẽ lấy giá trị từ thanh URL
        Blog.findOne({ slug: req.params.slug }).lean()
            .then(blog => {
                // Render file detail.hbs và truyền data vào biến 'blog'
                res.render('detail', { blog: blog });
            })
            .catch(next);
    }
}
module.exports = new BlogController();