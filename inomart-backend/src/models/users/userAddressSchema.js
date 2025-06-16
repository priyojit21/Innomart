import mongoose from "mongoose";

const userAddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  landMark: {
    type: String,
    required: true,
  },
  pinCode: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["Home", "Office"],
    default: "Home",
  },
  houseNo: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("UsersAddress", userAddressSchema);
