const Product = require("../../models/product.model");

const productsHelper = require("../../helper/product");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    //  Lấy data theo điều kiện
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  // Dùng forEach để thêm 1 thuộc tính mới
  productsNew = productsHelper.priceNewProduct(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: productsNew,
  });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active",
    };

    const product = await Product.findOne(find);

    res.render("client/pages/products/detail.pug", {
      product,
    });
  } catch (error) {
    res.redirect("/products");
  }
};
