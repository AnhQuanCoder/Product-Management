const Product = require("../../models/product.model");
const productHelper = require("../../helper/product");

// [GET] /search/
module.exports.index = async (req, res) => {
  const keySearch = req.query.keyword;

  let newProduct = [];

  if (keySearch) {
    const keySearchRegex = new RegExp(keySearch, "i");

    const products = await Product.find({
      title: keySearchRegex,
      deleted: false,
      status: "active",
    });

    newProduct = productHelper.priceNewProducts(products);

    res.render("client/pages/search/index.pug", {
      pageTitle: "Kết quả tìm kiếm",
      keySearch: keySearch,
      products: newProduct,
    });
  } else {
    res.redirect("/products/index.pug");
  }
};
