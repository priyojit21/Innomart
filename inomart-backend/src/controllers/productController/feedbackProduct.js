import { statusCode } from "../../config/constant.js";
import feedbackSchema from "../../models/product/feedbackSchema.js";
import productSchema from "../../models/product/productSchema.js";

export const productFeedback = async (req, res) => {
  try {
    const { userId, rating, review } = req.body;
    const { productId } = req.params;

    const existingFeedback = await feedbackSchema.findOne({
      productId,
      userId,
    });

    const existingProduct = await productSchema.findOne({
      _id: productId,
    });

    if (!existingProduct) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Product Doesn't Exist.",
      });
    }
    if (existingFeedback) {
      existingFeedback.rating = rating;
      existingFeedback.review = review;
      (existingFeedback.dateTime = Date.now() + 330 * 60000),
        await existingFeedback.save();

      return res.status(statusCode.OK).json({
        success: true,
        message: "Feedback Updated Successfully.",
      });
    }

    const newFeedback = await feedbackSchema.create({
      productId,
      userId,
      rating,
      review,
      dateTime: Date.now() + 330 * 60000,
    });

    if (newFeedback) {
      return res.status(statusCode.CREATED).json({
        success: true,
        message: "Feedback Added Successfully.",
      });
    }
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
