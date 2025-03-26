const productRouters = require("./products.route");
const homeRouters = require("./home.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category);

  app.use("/", homeRouters);

  app.use("/products", productRouters);
};
