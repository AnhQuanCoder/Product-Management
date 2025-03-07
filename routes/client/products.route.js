const express = require('express');
const router = express.Router();

// Controllers
const controller = require("../../controllers/client/products.controller");

router.get('/', controller.index);

module.exports = router;