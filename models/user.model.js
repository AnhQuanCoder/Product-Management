const mongoose = require("mongoose");
const generateStringHelper = require("../helper/generate.js");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
      type: String,
      default: generateStringHelper.generateRandomString(20),
    },
    phone: String,
    avatar: String,
    friendList: [
      {
        user_id: String,
        room_chat_id: String,
      },
    ],
    acceptFriends: Array,
    requestFriends: Array,
    statusOnline: String,
    status: {
      type: String,
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "users");
module.exports = User;
