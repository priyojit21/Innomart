import { statusCode } from "../../config/constant.js";
import Feedback from "../../models/product/feedbackSchema.js";
import Product from "../../models/product/productSchema.js";

export const getLatestReview = async (req, res) => {
  try {
    const { sellerId } = req.body;

    const allProducts = await Product.find({ sellerId });

    const productIds = allProducts.map((product) => product._id);

    const allFeedback = await Feedback.find({
      productId: { $in: productIds },
    })
      .sort({ dateTime: -1 })
      .limit(5)
      .populate(
        "userId productId",
        "firstName lastName phoneNumber profilePic productName productImages"
      );

    const productsSummary = allFeedback.map((feedback) => ({
      productName: feedback.productId.productName,
      rating: feedback.rating,
      review: feedback.review,
      userName: `${feedback.userId.firstName} ${feedback.userId.lastName}`,
      date: feedback.dateTime,
      productImage:feedback.productId.productImages[0]
    }));

    return res.status(statusCode.OK).json({
      success: true,
      feedbacks: productsSummary,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
