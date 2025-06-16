import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },

  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
  },

  review: {
    type: String,
  },

  dateTime: {
    type: Date,
    default: Date.now() + 330 * 60000,
  },
  comment: {
    type:String,
    default:""
  }
});

export default mongoose.model("Feedback", feedbackSchema);
