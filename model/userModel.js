const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  is_blocked: {
    type: Boolean,
    default: false,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  is_purchased : {
    type : Boolean,
    default : false
  },
  completedChapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chapter",
    },
  ],
});

const userModel = new mongoose.model("user", userSchema);
module.exports = userModel;
