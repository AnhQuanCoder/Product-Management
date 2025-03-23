const Account = require("../../models/account.model");
const md5 = require("md5");

const systemConfix = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Đăng nhập",
  });
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  // Xóa token trong cookie
  res.clearCookie("token");
  res.redirect(`${systemConfix.prefixAdmin}/auth/login`);
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let find = { deleted: false, email: email };
  const user = await Account.findOne(find);

  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect("back");
    return;
  }

  if (md5(password) != user.password) {
    req.flash("error", "Mật khẩu không chính xác");
    res.redirect("back");
    return;
  }

  if (user.status == "inactive") {
    req.flash("error", "Tài khoản của bạn đã bị khóa");
    res.redirect("back");
    return;
  }

  res.cookie("token", user.token);

  res.redirect(`${systemConfix.prefixAdmin}/dashboard`);
};
