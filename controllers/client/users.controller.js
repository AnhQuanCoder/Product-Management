const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");

// [GET] users/not-friend
module.exports.notFriend = async (req, res) => {
  // Socket
  usersSocket(res);
  // End Socket

  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });
  const listRequestFriends = myUser.requestFriends;
  const listAcceptFriends = myUser.acceptFriends;

  // Lọc data hiển thị những người dùng web và loại trừ chính mình, nhừng người đã gửi lời mời, những người đã chấp nhận bạn bè
  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: listRequestFriends } },
      { _id: { $nin: listAcceptFriends } },
    ],
    status: "active",
  }).select("fullName avatar");

  res.render("client/pages/users/not-friend.pug", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};

// [GET] users/request
module.exports.request = async (req, res) => {
  // Socket
  usersSocket(res);
  // End Socket

  const userId = res.locals.user.id;

  const myUser = await User.findOne({ _id: userId });
  const listRequestFriends = myUser.requestFriends;

  const users = await User.find({
    _id: { $in: listRequestFriends },
    status: "active",
    deleted: false,
  }).select("avatar fullName");

  res.render("client/pages/users/request.pug", {
    pageTitle: "Lời mời đã gửi",
    users: users,
  });
};

// [GET] users/accept
module.exports.accept = async (req, res) => {
  // Socket
  usersSocket(res);
  // End Socket

  const userId = res.locals.user.id;

  const myUser = await User.findOne({ _id: userId });
  const listAcceptFriends = myUser.acceptFriends;

  const users = await User.find({
    _id: { $in: listAcceptFriends },
    status: "active",
    deleted: false,
  }).select("avatar fullName");

  res.render("client/pages/users/accept.pug", {
    pageTitle: "Lời mời kết bạn",
    users: users,
  });
};
