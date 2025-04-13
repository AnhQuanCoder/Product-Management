const RoomChat = require("../../models/room-chat.model");

module.exports.isAccess = async (req, res, next) => {
  const userId = res.locals.user.id;
  const roomChatId = req.params.roomChatId;

  try {
    const isRoomChatExist = await RoomChat.findOne({
      _id: roomChatId,
      deleted: false,
      "users.user_id": userId,
    });

    if (isRoomChatExist) {
      console.log("di vao day");
      next();
    } else {
      res.redirect("/");
    }
  } catch (error) {
    res.redirect("/");
  }
};
