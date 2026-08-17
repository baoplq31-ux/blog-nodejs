const siteRouter = require('./site');
const authRoutes = require('./Authroutes');
const searchRoutes = require('./Searchroutes');
const blogRoutes = require('./Blogroutes');


function route(app){
    app.use('/', authRoutes);
    app.use('/', searchRoutes);
    app.use('/blogs', blogRoutes);
    // Mọi luồng truy cập cơ bản sẽ được đẩy sang cho siteRouter xử lý
    app.use('/', siteRouter);
}

module.exports = route;