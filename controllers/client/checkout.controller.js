const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productHelper = require("../../helper/product");

// [GET] /checkout/
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

  res.render("client/pages/checkout/index.pug", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};

// [POST] /checkout/order
module.exports.orderPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;

  //   Lặp để lấy các giá trị của products
  let products = [];

  const cart = await Cart.findOne({ _id: cartId });
  for (const product of cart.products) {
    const item = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };

    const itemProduct = await Product.findOne({ _id: item.product_id });
    item.price = itemProduct.price;
    item.discountPercentage = itemProduct.discountPercentage;

    products.push(item);

    // //   Cập nhật lại số lượng còn lại của sản phẩm
    const remainingQuantity = itemProduct.stock - product.quantity;
    await Product.updateOne(
      { _id: product.product_id },
      {
        stock: remainingQuantity,
      }
    );
  }

  //   Lưu data vào db
  const order = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  };

  const objectOrder = new Order(order);
  await objectOrder.save();

  //   Xóa sản phẩm trong giỏ hàng
  await Cart.updateOne({ _id: cartId }, { products: [] });

  req.flash("success", "Bạn đã đặt hàng thành công");

  res.redirect(`back`);
  // res.redirect(`/checkout/success/${order.id}`);
};
