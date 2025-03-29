const express = require("express");
const router = express.Router();

const userValidate = require("../../validates/client/user.validate");
const authMiddleware = require("../../middlewares/client/auth.middleware");

const controller = require("../../controllers/client/user.controller");

router.get("/register", controller.register);

router.post("/register", userValidate.registerPost, controller.registerPost);

router.get("/login", controller.login);

router.post("/login", userValidate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);

router.get("/password/forgot", controller.forgot);

router.get("/password/reset", controller.resetPassword);

router.post(
  "/password/reset",
  userValidate.resetPasswordPost,
  controller.resetPasswordPost
);

router.post(
  "/password/forgot",
  userValidate.forgotPasswordPost,
  controller.forgotPost
);

router.get("/password/otp", controller.otpPassword);

router.post("/password/otp", controller.otpPasswordPost);

router.get("/info", authMiddleware.requireAuth, controller.info);

module.exports = router;
