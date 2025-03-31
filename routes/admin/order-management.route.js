const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/order-management.controller");

router.get("/", controller.index);

router.get("/accept/:orderId", controller.accept);

router.get("/detail/:orderId", controller.detail);

router.delete("/delete/:orderId", controller.delete);

module.exports = router;
