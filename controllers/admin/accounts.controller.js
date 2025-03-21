const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");

const systemConfig = require("../../config/system");

// [GET] admin/accounts
module.exports.index = async (req, res) => {
  const find = { deleted: false };
  const records = await Account.find(find).select("-password -token");

  const updatedRecords = [];

  for (const record of records) {
    const role = await Role.findOne({ _id: record.role_id, deleted: false });
    const obj = record.toObject(); // Chuyển document thành object thuần
    obj.role = role; // Gán role vào object mới
    updatedRecords.push(obj);
  }

  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Danh sách tài khoản",
    records: updatedRecords,
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
