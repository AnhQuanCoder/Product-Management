const Product = require('../../models/product.model');

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        //  Lấy data theo điều kiện
        status: "active",
        deleted: false
    });

    // Dùng forEach để thêm 1 thuộc tính mới
    products.forEach((item) => {
        item.priceNew = (item.price * (1 - (item.discountPercentage / 100))).toFixed(0);
    });

    res.render("client/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products
    });
}