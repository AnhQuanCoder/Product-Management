const dashBoardRoutes = require("./dashboard.route");
const productsRoutes = require("./products.route");
const productsCategoryRoutes = require("./products-category.route");
const rolesRoutes = require("./roles.route");
const accountsRoutes = require("./accounts.route");
const authRoutes = require("./auth.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

const systemConfig = require("../../config/system");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashBoardRoutes
  );

  app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productsRoutes);

  app.use(
    PATH_ADMIN + "/products-category",
    authMiddleware.requireAuth,
    productsCategoryRoutes
  );

  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, rolesRoutes);

  app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountsRoutes);

  app.use(PATH_ADMIN + "/auth", authRoutes);
};
