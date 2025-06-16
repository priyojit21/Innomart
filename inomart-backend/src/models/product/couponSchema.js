import mongoose, { Schema } from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    minAmount: {
      type: Number,
      required: true,
    },
    validTillDateTime: {
      type: Date,
      required: true,
    },
    validFromDateTime: {
      type: Date,
      required: true,
    },
    offerDetails: {
      type: String,
      required: true,
    },
    offerType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    isFirstTime: {
      type: Boolean,
      required: true,
    },
    product: [
      {
        type: Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
    category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    customerLimit: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamp: true }
);

export default mongoose.model("Coupons", couponSchema);
