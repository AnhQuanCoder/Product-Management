const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  const tokenUser = req.cookies.tokenUser;
  if (!tokenUser) {
    res.redirect(`/user/login`);
  } else {
    const user = await User.findOne({ tokenUser: tokenUser }).select(
      "-password"
    );
    if (!user) {
      res.redirect(`/user/login`);
      return;
    }
    next();
  }
};
