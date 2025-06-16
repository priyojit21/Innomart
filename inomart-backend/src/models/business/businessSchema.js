import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  storeName: {
    type: String,
    required: true,
    unique: true,
  },

  type: {
    type: String,
    enum: ["Individual", "Small Business", "Company"],
    default: "Individual",
  },

  registrationNumber: {
    type: Number,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    default  : "",
  },

  logo: {
    type: String,
    default: "",
  },

  businessLicense: {
    type: String,
    default:"",
  },

  governmentIdType: {
    type: String,
    enum: ["Aadhaar Card", "Passport", "Driver's License", "PAN", "Voter ID"],
  },

  governmentId: {
    type: String,
    default : "",
  },

  status: {
    type : Number,
    default : 1,
  },
});

export default mongoose.model("Business", businessSchema);
