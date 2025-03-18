const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const controller = require("../../controllers/admin/products-category.controller");
const productValidate = require("../../validates/admin/products-category.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  productValidate.createPost,
  controller.createItemPost
);

module.exports = router;
