const express = require("express");
const router = express.Router();
const createValidate = require("../../validates/admin/products.validate");
const controller = require("../../controllers/admin/roles.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", createValidate.createPost, controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", controller.editPatch);

router.get("/detail/:id", controller.detail);

router.delete("/delete/:id", controller.delete);

router.get("/permissions", controller.permissions);

router.patch("/permissions", controller.permissionsPatch);

module.exports = router;
