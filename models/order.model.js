const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  cart_id: String,
  userInfo: {
    fullName: String,
    phone: String,
    address: String,
  },
  products: [
    {
      product_id: String,
      price: Number,
      discountPercentage: Number,
      quantity: Number,
    },
  ],
  isOrderCheck: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;
