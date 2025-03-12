const express = require("express");
const router = express.Router();
const multer  = require('multer');
const storageMulter = require('../../helper/storageMulter');
const upload = multer({ storage: storageMulter() });

const controller = require("../../controllers/admin/products.controller");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.createItem);

router.post("/create", upload.single('thumbnail'), controller.createItemPost);

module.exports = router;