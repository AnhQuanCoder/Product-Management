const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const controller = require("../../controllers/admin/products-category.controller");
const productValidate = require("../../validates/admin/products-category.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  productValidate.createPost,
  controller.createItemPost
);

router.patch("/change-multi", controller.changeMulti);

router.get("/detail/:id", controller.detail);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  productValidate.createPost,
  controller.editPatch
);

router.delete("/delete/:id", controller.delete);

module.exports = router;
