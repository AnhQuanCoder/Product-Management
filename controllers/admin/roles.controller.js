const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] admin/roles
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  const records = await Role.find(find);

  res.render("admin/pages/roles/index.pug", {
    pageTitle: "Nhóm quyền",
    records: records,
  });
};

// [GET] admin/roles/create
module.exports.create = (req, res) => {
  res.render("admin/pages/roles/create.pug", {
    pageTitle: "Thêm mới nhóm quyền",
  });
};

// [POST] admin/roles/create
module.exports.createPost = async (req, res) => {
  const role = new Role(req.body);
  await role.save();
  req.flash("success", "Tạo sản phẩm thành công");
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] admin/roles/get/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
    };

    const record = await Role.findOne({ _id: req.params.id }, find);

    res.render("admin/pages/roles/edit.pug", {
      pageTitle: "Chỉnh sửa quyền",
      record: record,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] admin/roles/get/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  try {
    await Role.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật sản phẩm thành công");
    res.redirect("back");
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [GET] admin/detail/get/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;

  try {
    const find = {
      deleted: false,
    };

    const record = await Role.findOne({ _id: id }, find);

    res.render("admin/pages/roles/detail.pug", {
      record: record,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [DELETE] admin/delete/get/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;

  await Role.updateOne({ _id: id }, { deleted: true });

  req.flash("success", "Xóa quyền thành công");
  res.redirect("back");
};
