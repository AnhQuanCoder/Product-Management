const productRouters = require("./products.route");
const homeRouters = require("./home.route");

module.exports = (app) => {
    app.use('/', homeRouters);
    app.use('/products', productRouters);
}