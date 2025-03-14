const express = require("express");
const router = express.Router();
const multer  = require('multer');
const storageMulter = require('../../helper/storageMulter');
const upload = multer({ storage: storageMulter() });

const controller = require("../../controllers/admin/products.controller");
const productValidate = require("../../validates/admin/products.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.createItem);

router.post("/create", upload.single('thumbnail'), productValidate.createPost, controller.createItemPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", upload.single('thumbnail'), productValidate.createPost, controller.editPatch);

router.get("/detail/:id", controller.detail);

module.exports = router;