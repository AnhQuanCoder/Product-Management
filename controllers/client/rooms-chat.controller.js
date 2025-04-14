// [GET] /rooms-chat
module.exports.index = (req, res) => {
  res.render("client/pages/rooms-chat/index", {
    pageTitle: "Danh sách phòng chat",
  });
};
