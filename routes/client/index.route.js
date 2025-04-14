const productRouters = require("./products.route");
const homeRouters = require("./home.route");
const searchRouters = require("./search.route");
const cartRouters = require("./cart.route");
const checkoutRouters = require("./checkout.route");
const userRouters = require("./user.route");
const chatRouters = require("./chat.route");
const usersRouters = require("./users.route");
const roomsChatRouters = require("./rooms-chat.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const authMiddleware = require("../../middlewares/client/auth.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);
  app.use(userMiddleware.infoUser);
  app.use(settingMiddleware.settingGeneral);

  app.use("/", homeRouters);

  app.use("/products", productRouters);

  app.use("/search", searchRouters);

  app.use("/cart", cartRouters);

  app.use("/checkout", checkoutRouters);

  app.use("/user", userRouters);

  app.use("/chat", authMiddleware.requireAuth, chatRouters);

  app.use("/users", authMiddleware.requireAuth, usersRouters);

  app.use("/rooms-chat", authMiddleware.requireAuth, roomsChatRouters);
};
