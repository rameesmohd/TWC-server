const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  transaction_id :{
    type : String,
    unique : true,
    required : true
  },
  payment_method: {
    type: String,
    required: true,
  },
  payment_status: {
    type: String,
    required : true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required : true,
  },
  user_id: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "user",
    required : true
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
