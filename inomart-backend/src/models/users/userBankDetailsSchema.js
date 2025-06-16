import mongoose from "mongoose";

const userBankDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: Number,
    required: true,
  },
  ifscCode: {
    type: String,
    required: true,
  },
  taxNumber: {
    type: String,
    required: true
  },
  payoutMethod: {
    type: String,
    enum: ["Cash", "Bank Transfer", "Debit/Credit Cards"],
    default: "Cash"
  }
});

export default mongoose.model("UsersBankDetails", userBankDetailsSchema);
