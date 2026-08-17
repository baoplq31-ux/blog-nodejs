require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { engine } = require('express-handlebars');

const app = express();
const db = require('./config/db');
const User = require('./app/models/User');
db.connect();
const port = process.env.PORT || 4000;

async function ensureDefaultAdmin() {
    try {
        const existing = await User.findOne({ username: 'admin' });
        if (!existing) {
            const hashed = await bcrypt.hash('admin123', 10);
            await User.create({
                username: 'admin',
                password: hashed,
                role: 'admin'
            });
            console.log('✅ Tài khoản admin mặc định đã được tạo: admin / admin123');
        }
    } catch (error) {
        console.log('❌ Không thể khởi tạo tài khoản admin mặc định:', error.message);
    }
}

app.use(express.static('public'));
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'bep-nha-minh-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 8
    }
}));

app.engine('hbs', engine({
    extname: '.hbs',
    helpers: {
        sum: (a, b) => a + b,
        eq: (a, b) => a === b,
        ifLoggedIn: function (user, options) {
            return user ? options.fn(this) : options.inverse(this);
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use((req, res, next) => {
    res.locals.user = req.session && req.session.user ? req.session.user : null;
    next();
});

const methodOverride = require('method-override');

// Ghi đè phương thức HTTP thông qua tham số _method trên URL
app.use(methodOverride('_method'));

// Gắn toàn bộ routes qua 1 điểm duy nhất
const route = require('./routes');
route(app);

(async () => {
    await ensureDefaultAdmin();
    app.listen(port, () => {
        console.log(`Server đang chạy tại http://localhost:${port}`);
    });
})();