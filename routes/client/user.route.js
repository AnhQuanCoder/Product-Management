const express = require("express");
const router = express.Router();

const userValidate = require("../../validates/client/user.validate");

const controller = require("../../controllers/client/user.controller");

router.get("/register", controller.register);

router.post("/register", userValidate.registerPost, controller.registerPost);

module.exports = router;
