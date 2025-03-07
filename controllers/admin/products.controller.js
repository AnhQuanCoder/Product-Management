const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helper/filterStatus");

// [GET] /admin/products
module.exports.index = async (req, res) => {
     // Filter
    const filterStatus = filterStatusHelper(req.query);
    console.log(filterStatus);

    let find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    // Search tìm kiếm sản phẩm
    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;

        // Dùng regex để có thể hoàn thành nốt chuỗi
        const regex = new RegExp(keyword, "i");
        find.title = regex;
    }

    const products = await Product.find(find);

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Trang sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword
    }); 
}