import mongoose, { Schema } from "mongoose";

const wishListSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },

  variationId : {
    type: Schema.Types.ObjectId,
    required: true,
  }
});

export default mongoose.model("wishList", wishListSchema);
