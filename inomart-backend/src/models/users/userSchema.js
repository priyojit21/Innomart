import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    defaultAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersAddress",
    },
    role: {
      type: String,
      enum: ["Customer", "Seller"],
      default: "Customer",
    },
    profilePic: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: "false",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    buyCount:{
      type:Number,
      default:0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Users", userSchema);
