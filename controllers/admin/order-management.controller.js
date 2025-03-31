const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");

const productHelper = require("../../helper/product");

// [GET] /admin/order-management
module.exports.index = async (req, res) => {
  const records = await Order.find({ isOrderCheck: false, deleted: false });

  for (const record of records) {
    for (const item of record.products) {
      const productId = item.product_id;
      const data = await Product.findOne({
        _id: productId,
        deleted: false,
      }).select("thumbnail title");

      item.price = item.price * item.quantity;
      item.priceNew = productHelper.priceNewProduct(item);
      item.title = data.title;
      item.thumbnail = data.thumbnail;
    }

    record.totalPrice = record.products.reduce((sum, item) => {
      // Đảm bảo item.priceNew là số và có giá trị hợp lệ
      const price = Number(item.priceNew) || 0;
      return sum + price;
    }, 0);
  }

  res.render("admin/pages/order-management/index.pug", {
    pageTitle: "Quản lý đơn hàng",
    records: records,
  });
};

// [GET] /admin/order-management/accept/:orderId
module.exports.accept = async (req, res) => {
  const orderId = req.params.orderId;
  await Order.updateOne({ _id: orderId }, { isOrderCheck: true });
  req.flash("success", "Đơn hàng đã được xác nhận");
  res.redirect("back");
};

// [GET] /admin/order-management/detail/:orderId
module.exports.detail = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const record = await Order.findOne({ _id: orderId });
    for (const item of record.products) {
      const productId = item.product_id;
      const data = await Product.findOne({ _id: productId }).select(
        "thumbnail title"
      );

      item.price = item.price * item.quantity;
      item.priceNew = productHelper.priceNewProduct(item);
      item.title = data.title;
      item.thumbnail = data.thumbnail;
    }

    record.totalPrice = record.products.reduce((sum, item) => {
      // Đảm bảo item.priceNew là số và có giá trị hợp lệ
      const price = Number(item.priceNew) || 0;
      return sum + price;
    }, 0);

    res.render("admin/pages/order-management/detail.pug", {
      pageTitle: `Chi tiết đơn hàng`,
      record: record,
    });
  } catch (error) {
    res.redirect(`${systemConfig}/dashboard`);
  }
};

// [DELETE] /admin/order-management/delete/:orderId
module.exports.delete = async (req, res) => {
  const orderId = req.params.orderId;
  await Order.updateOne({ _id: orderId }, { deleted: true });
  res.redirect("back");
};
