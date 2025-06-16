import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "Business",
  },

  productName: {
    type: String,
  },

  brandName: {
    type: String,
  },

  description: {
    type: String,
  },

  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],

  tags: [{ type: "String" }],

  variation: [
    new mongoose.Schema({
      regularPrice: {
        type: Number,
        default: 0,
      },
      sellingPrice: {
        type: Number,
        default: 0,
      },
      discountType: {
        type: String,
        enum: ["", "Fixed", "Percentage"],
        default: "",
      },
      discount: {
        type: Number,
        default: 0,
      },
      stock: {
        type: Number,
        default: 0,
      },
      skuId: {
        type: String,
        default: 0,
      },
      details: {},
    }),
  ],

  productImages: [
    {
      type: String,
      default: "",
    },
  ],

  productVideo: {
    type: String,
    default: "",
  },

  barcode: {
    type: String,
    default: "",
  },

  weight: {
    type: String,
    default: "",
  },

  dimensions: {
    type: String,
    default: "",
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  isDraft: {
    type: Boolean,
    default: false,
  },
  shippingMethods: {
    type: String,
    default: "",
  },
  deliveryTime: {
    type: String,
    default: "",
  },
  freeShipping: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Product", productSchema);
