const express = require("express");
const router = express.Router();

const chatMiddleware = require("../../middlewares/client/chat.middleware");

const controller = require("../../controllers/client/chat.controller");

router.get("/:roomChatId", chatMiddleware.isAccess, controller.index);

module.exports = router;
