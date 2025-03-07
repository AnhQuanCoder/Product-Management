const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");

// [GET] /admin/products
module.exports.index = async (req, res) => {
     // Filter
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    // Search tìm kiếm sản phẩm
    let objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    const products = await Product.find(find);

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Trang sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    }); 
}