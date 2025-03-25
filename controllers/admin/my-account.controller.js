const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const md5 = require("md5");

const systemConfig = require("../../config/system");

// [GET] /admin/my-account/
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Thông tin cá nhân",
  });
};

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  const roles = await Role.find({ deleted: false });

  res.render("admin/pages/my-account/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
    roles: roles,
  });
};

// [PACTH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;
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
    console.log(req.body);
    req.flash("success", "Thay đổi thành công");
  }

  res.redirect("back");
};
