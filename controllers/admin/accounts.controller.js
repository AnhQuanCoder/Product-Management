const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");

const systemConfig = require("../../config/system");

// [GET] admin/accounts
module.exports.index = async (req, res) => {
  const find = { deleted: false };
  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({ _id: record.role_id, deleted: false });
    record.role = role;
  }

  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Danh sách tài khoản",
    records: records,
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

// [DELETE] admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
  await Account.updateOne({ _id: req.params.id }, { deleted: true });
  req.flash("success", "Xóa tài khoản thành công");
  res.redirect("back");
};
