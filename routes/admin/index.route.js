const dashBoardRoutes = require("./dashboard.route");
const productsRoutes = require("./products.route");
const productsCategoryRoutes = require("./products-category.route");
const rolesRoutes = require("./roles.route");
const systemConfig = require("../../config/system");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(PATH_ADMIN + "/dashboard", dashBoardRoutes);

  app.use(PATH_ADMIN + "/products", productsRoutes);

  app.use(PATH_ADMIN + "/products-category", productsCategoryRoutes);

  app.use(PATH_ADMIN + "/roles", rolesRoutes);
};
