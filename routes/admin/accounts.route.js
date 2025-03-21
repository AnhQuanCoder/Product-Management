const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const controller = require("../../controllers/admin/accounts.controller.js");
const accountValidate = require("../../validates/admin/account.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  accountValidate.createPost,
  controller.createPost
);

module.exports = router;
