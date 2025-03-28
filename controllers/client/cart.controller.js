const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productHelper = require("../../helper/product");

// [GET] cart/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({ _id: cartId });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productInfo = await Product.findOne({ _id: item.product_id });
      item.productInfo = productInfo;

      productInfo.priceNew = productHelper.priceNewProduct(item.productInfo);

      item.totalPrice = item.quantity * productInfo.priceNew;
    }
  }

  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  res.render("client/pages/cart/index.pug", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);

  const cart = await Cart.findOne({ _id: cartId });
  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );

  if (existProductInCart) {
    const newQuantity = quantity + existProductInCart.quantity;
    console.log(newQuantity);

    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        "products.$.quantity": newQuantity,
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };

    await Cart.updateOne({ _id: cartId }, { $push: { products: objectCart } });
    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");
  }

  res.redirect("back");
};

// [GET] /cart/get/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;

  await Cart.updateOne(
    { _id: cartId },
    { $pull: { products: { product_id: productId } } }
  );
  req.flash("success", "Xóa sản phẩm khỏi giỏ hàng thành công");

  res.redirect("back");
};
