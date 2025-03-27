const Product = require("../../models/product.model");

const productHelper = require("../../helper/product");

// [GET] /home
module.exports.index = async (req, res) => {
  // Get featured products (Lấy ra sản phẩm nổi bật)
  let find = {
    deleted: false,
    featured: "1",
    status: "active",
  };
  const productsFreatured = await Product.find(find);

  const newProductsFreatured =
    productHelper.priceNewProducts(productsFreatured);
  // End get featured products

  // Get list products new (Lấy ra danh sách sản phẩm mới nhất)
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .limit(6)
    .sort({ position: "desc" });

  const newProductsNew = productHelper.priceNewProducts(productsNew);
  // Get list products new

  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang chủ",
    productsFreatured: newProductsFreatured,
    productsNew: newProductsNew,
  });
};
