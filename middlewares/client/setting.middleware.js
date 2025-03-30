const SettingGeneral = require("../../models/settings-general.model");

module.exports.settingGeneral = async (req, res, next) => {
  const settingReneral = await SettingGeneral.findOne({});

  res.locals.settingGeneral = settingReneral;

  next();
};
