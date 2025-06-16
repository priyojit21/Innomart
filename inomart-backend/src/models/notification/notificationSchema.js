import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Read", "Unread"],
    default: "Unread",
  },
});

export default mongoose.model("Notification", notificationSchema);
