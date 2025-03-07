const Product = require("../../models/product.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    // array button
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ]

    // Filter
    if (req.query.status) {
        const index = filterStatus.findIndex(item => item.status == req.query.status);
        filterStatus[index].class = "active";
    }   else {
        const index = filterStatus.findIndex(item => item.status == "");
        filterStatus[index].class = "active";
    }

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