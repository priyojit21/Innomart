import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("session", sessionSchema);
