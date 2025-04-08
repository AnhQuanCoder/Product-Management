const User = require("../../models/user.model");
const PorgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
const md5 = require("md5");

const generateHelper = require("../../helper/generate");
const sendMailerHelper = require("../../helper/sendMailer");
const ForgotPassword = require("../../models/forgot-password.model");

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

// [GET] /user/login
module.exports.login = (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

// [POST] /user/loginPost
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email, deleted: false });

  if (!user) {
    req.flash("error", `Email ${email} không tồn tại !`);
    res.redirect(`back`);
    return;
  }

  if (md5(password) != user.password) {
    req.flash("error", `Sai mật khẩu, vui lòng thử lại !`);
    res.redirect(`back`);
    return;
  }

  if (user.status == "inactive") {
    req.flash("error", `Tài khoản của bạn đã bị khóa !`);
    res.redirect(`back`);
    return;
  }

  res.cookie("tokenUser", user.tokenUser);

  // Cập nhật trạng thái online khi đăng nhập thành công của user
  await User.updateOne({ _id: user.id }, { statusOnline: "online" });

  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", user.id);
  });

  // Khi đăng nhập thành công lưu user_id vào collection carts
  await Cart.updateOne({ _id: req.cookies.cartId }, { user_id: user.id });

  res.redirect(`/`);
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  // Cập nhật trạng thái offline khi user đăng xuất
  await User.updateOne(
    { _id: res.locals.user.id },
    { statusOnline: "offline" }
  );

  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_OFFLINE", res.locals.user.id);
  });

  res.clearCookie("tokenUser");

  res.redirect(`/`);
};

// [GET] /user/password/forgot
module.exports.forgot = (req, res) => {
  res.render(`client/pages/user/forgot`, {
    pageTitle: "Lấy lại mật khẩu",
  });
};

// [POST] /user/password/forgotPost
module.exports.forgotPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email, deleted: false });

  if (!user) {
    req.flash("error", `Email ${email} không tồn tại !`);
    res.redirect(`back`);
    return;
  }

  // Việc 1: Tạo mã OTP và lưu OTP, email và collection forgot-password
  const otp = generateHelper.generateRandomNumber(8);

  const objectForgot = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };

  const forgotPassword = new ForgotPassword(objectForgot);
  await forgotPassword.save();

  // Việc 2: Gửi mã otp qua email của user
  const subject = "Mã OTP để xác minh lấy lại mật khẩu";
  const html = `Mã OTP xác minh lấy lại mật khẩu là: <b>${otp}</b>. Thời hạn sử dụng là 3 phút. Lưu ý, không được để lộ mã OTP`;
  sendMailerHelper.sendMail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/forgotPost
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
};

// [POST] /user/password/otpPasswordPost
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await PorgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    req.flash("error", "OTP không hợp lệ !");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({ email: email, deleted: false });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect(`/user/password/reset`);
};

// [GET] /user/password/reset
module.exports.resetPassword = (req, res) => {
  res.render("client/pages/user/reset", { pageTitle: "Đổi mật khẩu" });
};

// [POST] /user/password/resetPasswordPost
module.exports.resetPasswordPost = async (req, res) => {
  const password = md5(req.body.password);
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne({ tokenUser: tokenUser }, { password: password });

  res.redirect("/");
};

// [GET] /user/info
module.exports.info = async (req, res) => {
  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser,
    deleted: false,
  }).select("-password");

  res.render("client/pages/user/info", {
    pageTitle: "Thông tin tài khoản",
    user: user,
  });
};

// [GET] /user/edit
module.exports.edit = async (req, res) => {
  const userId = res.locals.user.id;
  const user = await User.findOne({ _id: userId }).select("-password -deleted");

  res.render("client/pages/user/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
  });
};

// [PATCH] /user/editPatch
module.exports.editPatch = async (req, res) => {
  const userId = res.locals.user.id;

  await User.updateOne({ _id: userId }, req.body);
  req.flash("success", "Cập nhật thông tin thành công");
  res.redirect(`back`);
};
