const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");

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

    // Pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    }, countProducts, req.query )

    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip).sort( {position: "desc"} );

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Trang sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    }); 
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    
    switch (type) {
        case "active":
            await Product.updateMany(
                { _id: { $in: ids } }, // Điều kiện: _id nằm trong mảng ids
                { status: "active" } 
            );
            break;

        case "inactive":
            await Product.updateMany(
                { _id: { $in: ids } }, // Điều kiện: _id nằm trong mảng ids
                { status: "inactive" } 
            );
            break;

        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } }, // Điều kiện: _id nằm trong mảng ids
                { 
                    deleted: true,
                    deletedAt: new Date()
                } 
            );
            break;

        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);

                console.log(`${id} - ${position}`);

                await Product.updateOne( {_id: id}, {position: position} );
            }

            break;
    }

    res.redirect("back");
}

// [DELETE] /admin/products/change-multi
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // await Product.deleteOne({_id: id});
    await Product.updateOne({_id: id}, {deleted: true, deletedAt: new Date()});
    res.redirect("back");
}