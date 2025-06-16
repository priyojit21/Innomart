import mongoose, { Schema } from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  razorpayOrderId : {
    type : String,
    required : true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  status: {
    type: String,
    enum: ["Success", "Failed", "Pending"],
    default : "Pending",
  },
  mode: {
    type: String,
    enum: ["card", "upi", "wallet"], 
    default : "card",
  },
  paymentId: {
    type: String,
    default : null,
  },
  signature : {
    type : String,
    default : null,
  }
});

export default mongoose.model("Payment", paymentSchema);
