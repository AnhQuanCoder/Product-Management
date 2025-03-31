const ProductCategory = require("../../models/products-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const Order = require("../../models/order.model");
const Role = require("../../models/role.model");

// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    order: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };

  //   ProductCategory
  statistic.categoryProduct.total = await ProductCategory.countDocuments({
    deleted: false,
  });
  statistic.categoryProduct.active = await ProductCategory.countDocuments({
    status: "active",
    deleted: false,
  });
  statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
    status: "inactive",
    deleted: false,
  });

  //   Product
  statistic.product.total = await Product.countDocuments({
    deleted: false,
  });
  statistic.product.active = await Product.countDocuments({
    status: "active",
    deleted: false,
  });
  statistic.product.inactive = await Product.countDocuments({
    status: "inactive",
    deleted: false,
  });

  //   Account
  statistic.account.total = await Account.countDocuments({
    deleted: false,
  });
  statistic.account.active = await Account.countDocuments({
    status: "active",
    deleted: false,
  });
  statistic.account.inactive = await Account.countDocuments({
    status: "inactive",
    deleted: false,
  });

  //   User
  statistic.user.total = await User.countDocuments({
    deleted: false,
  });
  statistic.user.active = await User.countDocuments({
    status: "active",
    deleted: false,
  });
  statistic.user.inactive = await User.countDocuments({
    status: "inactive",
    deleted: false,
  });

  //   Order
  statistic.order.total = await Order.countDocuments({
    deleted: false,
  });
  statistic.order.active = await Order.countDocuments({
    isOrderCheck: true,
    deleted: false,
  });
  statistic.order.inactive = await Order.countDocuments({
    isOrderCheck: false,
    deleted: false,
  });

  res.render("admin/pages/dashboard/index.pug", {
    pageTitle: "Trang tổng quan",
    statistic: statistic,
  });
};
