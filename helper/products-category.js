const ProductCategory = require("../models/products-category.model");

module.exports.getSubCategory = async (parentId) => {
  // function tìm các danh mục con trong danh mục cha
  const getCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false,
    });

    let allSub = [...subs];

    for (const sub of subs) {
      const childs = await getCategory(sub.id);
      allSub = allSub.concat(childs); // nối mảng
    }

    return allSub;
  };

  const result = await getCategory(parentId);
  return result;
};
