const ProductsCategory = require("../../models/products-category.model");
const systemConfig = require("../../config/system");
const flash = require("express-flash");

const searchHelper = require("../../helper/search");
const filterStatusHelper = require("../../helper/filterStatus");
const paginationHelper = require("../../helper/pagination");

// [GET] admin/products-category
module.exports.index = async (req, res) => {
  // Filter
  const filterStatus = filterStatusHelper(req.query);

  const find = { deleted: false };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  // End search

  // Sort
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  // End sort

  let count = 0;
  function createTree(arr, parentId = "") {
    const tree = [];
    arr.forEach((item) => {
      if (item.parent_id === parentId) {
        count++;
        const newItem = item;
        newItem.index = count;
        const children = createTree(arr, item.id);
        if (children.length > 0) {
          newItem.children = children;
        }
        tree.push(newItem);
      }
    });
    return tree;
  }

  const records = await ProductsCategory.find(find).sort(sort);

  const newRecords = createTree(records);

  res.render("admin/pages/products-category/index.pug", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};

// [PATCH] admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  await ProductsCategory.updateOne(
    { _id: req.params.id },
    { status: req.params.status }
  );
  res.redirect("back");
};

// [PATCH] admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await ProductsCategory.updateMany(
        { _id: { $in: ids } }, // Điều kiện: _id nằm trong mảng ids
        { status: "active" }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} sản phẩm thành công !`
      );
      break;
    case "inactive":
      await ProductsCategory.updateMany(
        { _id: { $in: ids } }, // Điều kiện: _id nằm trong mảng ids
        { status: "inactive" }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} sản phẩm thành công !`
      );
      break;
    case "delete-all":
      await ProductsCategory.updateMany(
        { _id: { $in: ids } }, // Điều kiện: _id nằm trong mảng ids
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );
      req.flash("success", `Xóa ${ids.length} sản phẩm thành công !`);
      break;

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await ProductsCategory.updateOne({ _id: id }, { position: position });
      }
      req.flash(
        "success",
        `Thay đổi vị trí ${ids.length} sản phẩm thành công !`
      );
      break;
  }
  res.redirect("back");
};

// [GET] admin/products-category/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false,
  };

  function createTree(arr, parentId = "") {
    const tree = [];
    arr.forEach((item) => {
      if (item.parent_id === parentId) {
        const newItem = item;
        const children = createTree(arr, item.id);
        if (children.length > 0) {
          newItem.children = children;
        }
        tree.push(newItem);
      }
    });
    return tree;
  }

  const records = await ProductsCategory.find(find);

  const newRecords = createTree(records);

  res.render("admin/pages/products-category/create.pug", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
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

// [GET] admin/products-category/detail/:id
module.exports.detail = (req, res) => {
  res.render("admin/pages/products-category/detail.pug", {
    pageTitle: "Chi tiết danh mục",
  });
};
