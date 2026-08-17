function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }

    return res.redirect('/login');
}

function requireAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }

    return res.redirect('/login');
}

module.exports = { requireAuth, requireAdmin };
