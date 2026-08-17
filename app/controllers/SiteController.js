const Blog = require('../models/Blog');

class SiteController {

    index(req, res, next) {
        Blog.find({})
            .sort({ createdAt: -1 })
            .lean()
            .then(blogs => {
                res.render('home', { blogs });
            })
            .catch(next);
    }

    search(req, res, next) {
        const q = req.query.q ? req.query.q.trim() : '';

        const query = q
            ? {
                $or: [
                    { name: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } },
                    { slug: { $regex: q, $options: 'i' } }
                ]
            }
            : {};

        Blog.find(query)
            .sort({ createdAt: -1 })
            .lean()
            .then(blogs => {
                res.render('search', { blogs, q });
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