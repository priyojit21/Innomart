import { statusCode } from "../../config/constant.js";
import Feedback from "../../models/product/feedbackSchema.js";
import Product from "../../models/product/productSchema.js";

export const getAllReview = async (req, res) => {
  try {
    const { sellerId } = req.body;

    const allProducts = await Product.find({ sellerId });
    const productIds = allProducts.map((product) => product._id);

    const allFeedback = await Feedback.find({
      productId: { $in: productIds },
    }).populate(
      "userId productId",
      "firstName lastName phoneNumber profilePic productName productImages"
    );

    const productMap = {};
    let totalRating = 0;
    let ratingCount = 0;

    allFeedback.forEach((feedback) => {
      const productId = feedback.productId._id;
      if (!productMap[productId]) {
        productMap[productId] = {
          productName: feedback.productId.productName,
          reviews: [],
          ratingSum: 0,
          ratingCount: 0,
          ratingsCount: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
          }
        };
      }

      if (feedback.rating) {
        productMap[productId].ratingSum += feedback.rating;
        productMap[productId].ratingCount++;
        totalRating += feedback.rating;
        ratingCount++;

        const r = Math.floor(feedback.rating);
        if (productMap[productId].ratingsCount[r] !== undefined) {
          productMap[productId].ratingsCount[r]++;
        }
      }

      if (feedback.review) {
        productMap[productId].reviews.push({
          review: feedback.review,
          user: `${feedback.userId.firstName}`,
          profilePic: `${feedback.userId.profilePic}`,
          rating: feedback.rating,
          dateTime: feedback.dateTime,
          comment: feedback.comment,
          feedbackId:feedback._id.toString(), 
        });
      }
    });

    const productsSummary = Object.keys(productMap).map((productId) => {
      const product = productMap[productId];
      return {
        productId: productId,
        productName: product.productName,
        averageRating: product.ratingCount
          ? Number((product.ratingSum / product.ratingCount).toFixed(1))
          : 0,
        totalReviews: product.ratingCount,
        ratingsCount: product.ratingsCount,
        topReviews: product.reviews.slice(0, 3),
      };
    });

    return res.status(statusCode.OK).json({
      success: true,
      averageSellerRating: ratingCount
        ? Number((totalRating / ratingCount).toFixed(1))
        : 0,
      productLength: productsSummary.length,
      totalSellerReviews: ratingCount,
      productSummaries: productsSummary,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
