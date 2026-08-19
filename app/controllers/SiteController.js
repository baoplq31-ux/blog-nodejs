const Blog = require('../models/Blog');

class SiteController {

    index(req, res, next) {
        const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
        const limit = 6;

        Promise.all([
            Blog.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            Blog.countDocuments({})
        ])
            .then(([blogs, total]) => {
                res.render('home', {
                    blogs,
                    pagination: { page, totalPages: Math.ceil(total / limit), hasPrevious: page > 1, hasNext: page * limit < total, previousPage: page - 1, nextPage: page + 1 }
                });
            })
            .catch(next);
    }

    search(req, res, next) {
        const q = req.query.q ? req.query.q.trim() : '';
        const category = req.query.category || '';
        const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
        const limit = 6;

        const query = {};
        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { slug: { $regex: q, $options: 'i' } }
            ];
        }
        if (category === 'Món mặn') {
            query.$and = [{ $or: [{ category: 'Món mặn' }, { category: { $exists: false } }] }];
        } else if (category) {
            query.category = category;
        }

        Promise.all([
            Blog.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            Blog.countDocuments(query)
        ])
            .then(([blogs, total]) => {
                res.render('search', {
                    blogs,
                    q,
                    category,
                    pagination: { page, totalPages: Math.ceil(total / limit), hasPrevious: page > 1, hasNext: page * limit < total, previousPage: page - 1, nextPage: page + 1 }
                });
            })
            .catch(next);
    }

    about(req, res) {
        res.render('about');
    }

    contact(req, res) {
        res.render('contact');
    }
}

module.exports = new SiteController();