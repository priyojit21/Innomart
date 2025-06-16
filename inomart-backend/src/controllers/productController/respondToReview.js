import { statusCode } from "../../config/constant.js";
import feedbackSchema from "../../models/product/feedbackSchema.js";

export const respondToReview = async (req, res) => {
  try {
    const { feedbackId, comment } = req.body;

    if (!feedbackId || !comment) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Feedback ID and comment are required.",
      });
    }

    const feedback = await feedbackSchema.findById(feedbackId);
    if (!feedback) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Feedback not found.",
      });
    }
    if (feedback.comment) {
      feedback.comment = comment;
      await feedback.save();
      return res.status(statusCode.OK).json({
        success: true,
        message: "Seller comment updated successfully.",
        feedback,
      });
    } else {
      feedback.comment = comment;
      await feedback.save();
      return res.status(statusCode.OK).json({
        success: true,
        message: "Seller comment added successfully.",
        feedback,
      });
    }
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
