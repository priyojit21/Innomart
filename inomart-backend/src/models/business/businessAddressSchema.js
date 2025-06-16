import mongoose from "mongoose";

const businessAddressSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Business",
  },
  country: {
    type: String,
    required: true,
  },

  address : {
    type: String,
  },

  zipCode: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("BusinessAddress", businessAddressSchema);
