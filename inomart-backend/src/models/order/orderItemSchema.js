import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  variationId:{
    type: Schema.Types.ObjectId,
    required: true
  },
  price:{
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  addressId:{
    type: Schema.Types.ObjectId,
    ref: "UsersAddress",
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Shipped",
      "Out For Delivery",
      "Delivered",
      "Cancel Initiated",
      "Cancel",
      "Refund",
      "Replace",
    ],
    default:"Pending"
  },
  orderAt: {
    type: Date,
    default: Date.now(),
  },
  deliverAt: {
    type: Date,
    default: Date.now(),
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
    default:null
  }
});

export default mongoose.model("OrderItem", orderSchema);
