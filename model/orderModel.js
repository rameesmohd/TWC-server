const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  transaction_id :{
    type : String,
    unique : true,
    required : true
  },
  payment_method: {
    //0-usdt
    //1-local_bank
    //2-phone_pay
    type: String,
    required: true,
  },
  payment_status: {
    //0 - pending
    //1 - success
    //2 - rejected
    type: String,
    required : true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: false,
  },
  user_id: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  user_email : {
    type : String,
    required  :true
  },
  screenshot:{
    type : String,
    required : false
  }
});

const orderModel = new mongoose.model("order", orderSchema);
module.exports = orderModel;
