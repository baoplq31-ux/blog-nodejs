const bcrypt = require('bcryptjs');
const User = require('../models/User');

class AuthController {
    login(req, res) {
        if (req.session && req.session.user) {
            return res.redirect('/blogs/my-blogs');
        }
        res.render('login', { layout: 'main' });
    }

    async loginPost(req, res, next) {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).render('login', {
                    error: 'Tên đăng nhập hoặc mật khẩu không đúng.',
                    layout: 'main'
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).render('login', {
                    error: 'Tên đăng nhập hoặc mật khẩu không đúng.',
                    layout: 'main'
                });
            }

            req.session.user = {
                id: user._id,
                username: user.username,
                role: user.role
            };

            return res.redirect('/blogs/my-blogs');
        } catch (error) {
            next(error);
        }
    }

    async register(req, res, next) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).render('login', {
                    error: 'Vui lòng nhập đủ tên đăng nhập và mật khẩu.',
                    layout: 'main'
                });
            }

            const existing = await User.findOne({ username });
            if (existing) {
                return res.status(409).render('login', {
                    error: 'Tên đăng nhập đã tồn tại.',
                    layout: 'main'
                });
            }

            const hashed = await bcrypt.hash(password, 10);
            const user = await User.create({
                username,
                password: hashed,
                role: 'admin'
            });

            req.session.user = {
                id: user._id,
                username: user.username,
                role: user.role
            };

            return res.redirect('/blogs/my-blogs');
        } catch (error) {
            next(error);
        }
    }

    logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
}

module.exports = new AuthController();