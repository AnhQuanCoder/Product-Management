const ProductsCategory = require("../../models/products-category.model");
const systemConfig = require("../../config/system");

// [GET] admin/products-category
module.exports.index = async (req, res) => {
  const find = { deleted: false };

  const records = await ProductsCategory.find(find);

  res.render("admin/pages/products-category/index.pug", {
    pageTitle: "Danh mục sản phẩm",
    records: records,
  });
};

// [GET] admin/products-category/create
module.exports.create = (req, res) => {
  res.render("admin/pages/products-category/create.pug", {
    pageTitle: "Tạo danh mục sản phẩm",
  });
};

// [POST] admin/products-category/create
module.exports.createItemPost = async (req, res) => {
  if (req.body.position == "") {
    const countProducts = await ProductsCategory.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const records = new ProductsCategory(req.body);
  await records.save();

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
