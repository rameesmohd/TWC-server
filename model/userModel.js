const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_name :{
    type : String,
    required : true
  },
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
  join_date : {
    type: Date,
    required : true
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
  is_completed : {
    type:Boolean,
    default : false
  },
  completed_chapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chapter",
    },
  ],
  curr_token: {
    type: String,
    default: null,
  },
});

const userModel = new mongoose.model("user", userSchema);
module.exports = userModel;
