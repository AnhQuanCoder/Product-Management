const User = require("../../models/user.model");
const md5 = require("md5");

// [GET] /user/register
module.exports.register = (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (existEmail) {
    req.flash("error", `Email ${req.body.email} đã tồn tại !`);
    res.redirect("back");
    return;
  }

  req.body.password = md5(req.body.password);

  delete req.body.rePassword;

  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");
};
