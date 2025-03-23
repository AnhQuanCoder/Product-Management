const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");

const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");

const systemConfig = require("../../config/system");

// [GET] admin/accounts
module.exports.index = async (req, res) => {
  // Filter
  const filterStatus = filterStatusHelper(req.query);

  const find = { deleted: false };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Search tìm kiếm sản phẩm
  let objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.fullName = objectSearch.regex;
  }

  // Pagination
  const countAccounts = await Account.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    countAccounts,
    req.query
  );

  // Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.fullName = "desc";
  }
  // End sort

  const records = await Account.find(find)
    .select("-password -token")
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }

  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Danh sách tài khoản",
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [GET] admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/accounts/create.pug", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles,
  });
};

// [POST] admin/accounts/create
module.exports.createPost = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (emailExist) {
      req.flash("error", "Email đã tồn tại, vui lòng sử dụng email khác");
      res.redirect("back");
    } else {
      req.body.password = md5(req.body.password);
      const record = new Account(req.body);
      await record.save();
      req.flash("success", "Thêm tài khoản thành công");
      res.redirect("back");
    }
  } catch (error) {
    req.flash("error", "Thêm tài khoản thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [GET] admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };

  try {
    const data = await Account.findOne(find);

    const roles = await Role.find({ deleted: false });

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  const emailExist = await Account.findOne({
    _id: { $ne: id }, // ne: tức là not equals
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Thay đổi thành công");
  }

  res.redirect("back");
};

// [GET] admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  let find = {
    _id: id,
    deleted: false,
  };

  try {
    const record = await Account.findOne(find);

    if (record.role_id) {
      record.role = await Role.findOne({ _id: record.role_id, deleted: false });
    }

    res.render("admin/pages/accounts/detail", { record: record });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] admin/accounts/change-status/:id/:status
module.exports.changeStatus = async (req, res) => {
  await Account.updateOne(
    { _id: req.params.id },
    { status: req.params.status }
  );
  req.flash("success", "Thay đổi trạng thái thành công");
  res.redirect("back");
};

// [PATCH] admin/accounts/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Account.updateMany(
        { _id: { $in: ids } }, // Điều kiện: _id nằm trong mảng ids
        { status: "active" }
      );
      break;
    case "inactive":
      await Account.updateMany(
        { _id: { $in: ids } }, // Điều kiện: _id nằm trong mảng ids
        { status: "inactive" }
      );
      break;
    case "delete-all":
      await Account.updateMany(
        { _id: { $in: ids } }, // Điều kiện: _id nằm trong mảng ids
        { deleted: true }
      );
      break;
  }
  req.flash("success", "Thay đổi trạng thái thành công");
  res.redirect("back");
};

// [DELETE] admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
  await Account.updateOne({ _id: req.params.id }, { deleted: true });
  req.flash("success", "Xóa tài khoản thành công");
  res.redirect("back");
};
