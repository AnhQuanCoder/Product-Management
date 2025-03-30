const SettingGereral = require("../../models/settings-general.model");

// [GET] /settings/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGereral.findOne({});

  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    settingGeneral: settingGeneral,
  });
};

// [PATCH] /settings/generalPatch
module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGereral.findOne({});
  if (settingGeneral) {
    await SettingGereral.updateOne({ _id: settingGeneral.id }, req.body);
  } else {
    const record = new SettingGereral(req.body);
    await record.save();
  }
  req.flash("success", "Cập nhật thành công !");
  res.redirect("back");
};
