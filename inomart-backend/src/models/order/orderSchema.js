import mongoose, { Schema } from "mongoose";

const allOrderSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  totalAmount: {
    type: Number,
  },
});

export default mongoose.model("Order", allOrderSchema);
