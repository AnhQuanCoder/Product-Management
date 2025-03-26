const ProductsCategory = require("../../models/products-category.model");

module.exports.category = async (req, res, next) => {
  const find = {
    deleted: false,
  };

  let count = 0;
  function createTree(arr, parentId = "") {
    const tree = [];
    arr.forEach((item) => {
      if (item.parent_id === parentId) {
        count++;
        const newItem = item;
        newItem.index = count;
        const children = createTree(arr, item.id);
        if (children.length > 0) {
          newItem.children = children;
        }
        tree.push(newItem);
      }
    });
    return tree;
  }

  const records = await ProductsCategory.find(find);

  const newProductsCategory = createTree(records);

  res.locals.layoutProductsCategory = newProductsCategory;

  next();
};
