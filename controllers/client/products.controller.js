const Product = require("../../models/product.model");
const ProductCategory = require("../../models/products-category.model");

const productHelper = require("../../helper/product");
const productsCategoryHelper = require("../../helper/products-category");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    //  Lấy data theo điều kiện
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  // Dùng forEach để thêm 1 thuộc tính mới
  const productsNew = productHelper.priceNewProducts(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: productsNew,
  });
};

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status: "active",
    };

    const product = await Product.findOne(find);

    if (product.products_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.products_category_id,
        status: "active",
        deleted: false,
      });

      product.category = category;
    }

    product.priceNew = productHelper.priceNewProduct(product);

    res.render("client/pages/products/detail.pug", {
      product,
    });
  } catch (error) {
    res.redirect("/products");
  }
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategory,
      deleted: false,
      status: "active",
    });

    // function tìm các danh mục con
    const listSubCategorys = await productsCategoryHelper.getSubCategory(
      category.id
    );

    const listSubCategoryId = listSubCategorys.map((item) => item.id);

    const product = await Product.find({
      products_category_id: { $in: [category.id, ...listSubCategoryId] },
      deleted: false,
      status: "active",
    }).sort({ position: "desc" });

    const productsNew = productHelper.priceNewProducts(product);

    res.render("client/pages/products/index.pug", {
      pageTitle: category.title,
      products: productsNew,
    });
  } catch (error) {
    console.log("error");
    res.redirect("/products");
  }
};
