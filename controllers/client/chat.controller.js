const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

//  [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  const roomChatId = req.params.roomChatId;

  // CLIENT_SEND_MESSAGE
  _io.once("connection", (socket) => {
    socket.join(roomChatId);
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      // Lưu câu chat vào db
      const chat = new Chat({
        user_id: userId,
        room_chat_id: roomChatId,
        content: content,
      });
      await chat.save();

      _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: content,
      });
    });
    // End CLIENT_SEND_MESSAGE

    // CLIENT_SEND_TYPING
    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.to(roomChatId).emit("SERVER_SEND_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    });
  });
  // End CLIENT_SEND_TYPING

  // Lấy data người gửi tin nhắn
  const chats = await Chat.find({ deleted: false, room_chat_id: roomChatId });

  for (const chat of chats) {
    const infoUser = await User.findOne({ _id: chat.user_id }).select(
      "fullName"
    );
    chat.infoUser = infoUser;
  }
  // End SocketIO

  res.render("client/pages/chat/index.pug", {
    pageTitle: "Chat",
    chats: chats,
  });
};
