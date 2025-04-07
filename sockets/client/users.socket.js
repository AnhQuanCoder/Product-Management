const User = require("../../models/user.model");

module.exports = async (res) => {
  _io.once("connection", (socket) => {
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      console.log(myUserId); // ID của ông A
      console.log(userId); // ID của ông B

      // Việc 1: Thêm id của ông A vào acceptFriends của B
      const existAInB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      }); // Kiểm tra xem trong mảng acceptFriends của B có tồn tại ông A không

      if (!existAInB) {
        await User.updateOne(
          { _id: userId },
          { $push: { acceptFriends: myUserId } }
        );
      }

      // Việc 2: Thêm id của ông B vào requestFriends của A
      const existBInA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      }); // Kiểm tra xem trong mảng requestFriends của B có tồn tại ông A không

      if (!existBInA) {
        await User.updateOne(
          { _id: myUserId },
          { $push: { requestFriends: userId } }
        );
      }
    });
  });
};
