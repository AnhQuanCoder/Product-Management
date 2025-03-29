const express = require("express");
const router = express.Router();

const userValidate = require("../../validates/client/user.validate");

const controller = require("../../controllers/client/user.controller");

router.get("/register", controller.register);

router.post("/register", userValidate.registerPost, controller.registerPost);

router.get("/login", controller.login);

router.post("/login", userValidate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);

router.get("/password/forgot", controller.forgot);

router.post(
  "/password/forgot",
  userValidate.forgotPasswordPost,
  controller.forgotPost
);

router.get("/password/otp", controller.otpPassword);

router.post("/password/otp", controller.otpPasswordPost);

module.exports = router;
