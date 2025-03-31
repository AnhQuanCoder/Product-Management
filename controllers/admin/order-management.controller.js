const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

const productHelper = require("../../helper/product");

module.exports.index = async (req, res) => {
  const records = await Order.find({ isOrderCheck: false });

  for (const record of records) {
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
  }

  res.render("admin/pages/order-management/index.pug", {
    pageTitle: "Quản lý đơn hàng",
    records: records,
  });
};
