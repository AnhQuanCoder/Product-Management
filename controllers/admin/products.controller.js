const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");

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

    req.flash('success', 'Cập nhật trạng thái thành công !');

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
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công !`);
            break;

        case "inactive":
            await Product.updateMany(
                { _id: { $in: ids } }, // Điều kiện: _id nằm trong mảng ids
                { status: "inactive" } 
            );
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công !`);
            break;

        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } }, // Điều kiện: _id nằm trong mảng ids
                { 
                    deleted: true,
                    deletedAt: new Date()
                } 
            );
            req.flash('success', `Xóa ${ids.length} sản phẩm thành công !`);
            break;

        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);

                console.log(`${id} - ${position}`);

                await Product.updateOne( {_id: id}, {position: position} );
            }
            req.flash('success', `Thay đổi vị trí ${ids.length} sản phẩm thành công !`);
            break;
    }

    res.redirect("back");
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // await Product.deleteOne({_id: id});
    await Product.updateOne({_id: id}, {deleted: true, deletedAt: new Date()});
    res.redirect("back");
}

// [GET] /admin/products/create
module.exports.createItem = async (req, res) => {
   res.render("admin/pages/products/create.pug",{
    pageTitle: "Thêm mới sản phẩm"
}); 
}

// [POST] /admin/products/create
module.exports.createItemPost = async (req, res) => {
    
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }   else {
        req.body.position = parseInt(req.body.position);
    }

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
    
        const product = await Product.findOne(find);
    
        res.render(`admin/pages/products/edit.pug`, {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        }); 
    } catch (error) {
        res.redirect(`/admin/products`);
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        await Product.updateOne({_id: req.params.id}, req.body);
        req.flash('success', `Cập nhật sản phẩm thành công !`);
    } catch (error) {
        req.flash('error', `Cập nhật sản phẩm thất bại !`);
    }
    res.redirect("back");
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    try {
        const find = {
            _id: id,
            deleted: false
        }

        const product = await Product.findOne(find);
        res.render("admin/pages/products/detail", {
            product: product
        })

    } catch (error) {
        res.redirect("/admin/products");
    }
}