const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

// [GET] /rooms-chat/
module.exports.index = (req, res) => {
  res.render("client/pages/rooms-chat/index", {
    pageTitle: "Danh sách phòng chat",
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const listFriend = res.locals.user.friendList;

  for (const friend of listFriend) {
    const infoFriend = await User.findOne({
      _id: friend.user_id,
    }).select("fullName");
    friend.infoFriend = infoFriend;
  }

  res.render("client/pages/rooms-chat/create", {
    pageTitle: "Tạo phòng chat",
    listFriend: listFriend,
  });
};

// [POST] /rooms-chat/createPost
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.usersId;

  const datachat = {
    title: title,
    typeRoom: "group",
    users: [],
  };

  usersId.forEach((userId) => {
    datachat.users.push({
      user_id: userId,
      role: "user",
    });
  });

  datachat.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin",
  });

  const room = new RoomChat(datachat);
  await room.save();

  res.redirect(`/chat/${room.id}`);
};
