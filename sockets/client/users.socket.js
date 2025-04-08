const User = require("../../models/user.model");

module.exports = async (res) => {
  _io.once("connection", (socket) => {
    // Tính năng người dùng gửi yêu cầu kết bạn
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

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

      // Lấy độ dài mảng acceptFriends của B trả về cho B
      const infoUserB = await User.findOne({
        _id: userId,
      });

      const lengthAcceptFriends = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends,
      });
    });

    // Tính năng người dùng hủy yêu cầu kết bạn
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // Việc 1: Xóa id của ông A trong acceptFriends của B
      const existAInB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      }); // Kiểm tra xem trong mảng acceptFriends của B có tồn tại ông A không

      if (existAInB) {
        await User.updateOne(
          { _id: userId },
          { $pull: { acceptFriends: myUserId } }
        );
      }

      // Việc 2: Xóa id của ông B trong requestFriends của A
      const existBInA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      }); // Kiểm tra xem trong mảng requestFriends của B có tồn tại ông A không

      if (existBInA) {
        await User.updateOne(
          { _id: myUserId },
          { $pull: { requestFriends: userId } }
        );
      }

      // Lấy độ dài mảng acceptFriends của B trả về cho B
      const infoUserB = await User.findOne({
        _id: userId,
      });

      const lengthAcceptFriends = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends,
      });
    });

    // Tính năng người dùng từ chối yêu cầu kết bạn
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // console.log(myUserId); // id của ông B
      // console.log(userId); // id của ông A

      // Việc 1: Xóa id của ông A trong acceptFriends của B
      const existAInB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      }); // Kiểm tra xem trong mảng acceptFriends của B có tồn tại ông A không

      if (existAInB) {
        await User.updateOne(
          { _id: myUserId },
          { $pull: { acceptFriends: userId } }
        );
      }

      // Việc 2: Xóa id của ông B trong requestFriends của A
      const existBInA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      }); // Kiểm tra xem trong mảng requestFriends của B có tồn tại ông A không

      if (existBInA) {
        await User.updateOne(
          { _id: userId },
          { $pull: { requestFriends: myUserId } }
        );
      }
    });

    // Tính năng người dùng chấp nhận yêu cầu kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // console.log(myUserId); // id của ông B
      // console.log(userId); // id của ông A

      // Việc 1: Thêm {user_id, room_chat_id} của A vào friendList của B
      // Việc 2: Xóa id của ông A trong acceptFriends của B
      const existAInB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      }); // Kiểm tra xem trong mảng acceptFriends của B có tồn tại ông A không

      if (existAInB) {
        await User.updateOne(
          { _id: myUserId },
          {
            $push: {
              friendList: {
                user_id: userId,
                room_chat_id: "",
              },
            },
            $pull: { acceptFriends: userId },
          }
        );
      }

      // Việc 3: Thêm {user_id, room_chat_id} của B vào friendList của A
      // Việc 4: Xóa id của ông B trong requestFriends của A
      const existBInA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      }); // Kiểm tra xem trong mảng requestFriends của B có tồn tại ông A không

      if (existBInA) {
        await User.updateOne(
          { _id: userId },
          {
            $push: {
              friendList: {
                user_id: myUserId,
                room_chat_id: "",
              },
            },
            $pull: { requestFriends: myUserId },
          }
        );
      }
    });
  });
};
