const Product = require("../../models/product.model");

const productsHelper = require("../../helper/product");

// [GET] /home
module.exports.index = async (req, res) => {
  // Get featured products (Lấy ra sản phẩm nổi bật)
  let find = {
    deleted: false,
    featured: "1",
    status: "active",
  };
  const productsFreatured = await Product.find(find);
  // End get featured products

  // Dùng priceNewProduct để tính giá mới
  const newProducts = productsHelper.priceNewProduct(productsFreatured);

  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang chủ",
    productsFreatured: newProducts,
  });
};
