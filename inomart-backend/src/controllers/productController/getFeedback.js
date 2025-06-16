import { statusCode } from "../../config/constant.js";
import Feedback from "../../models/product/feedbackSchema.js";
import Product from "../../models/product/productSchema.js";

export const getFeedback = async (req, res) => {
  try {
    const { sellerId, productId, timeRange } = req.body;
    let query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if (productId) {
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Product Doesn't Exist.",
        });
      }

      let startDate = new Date();
      switch (timeRange) {
        case "daily":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "weekly":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "monthly":
          startDate.setDate(startDate.getDate() - 30);
          break;
        default:
          startDate = null;
      }

      query = { productId };
      if (startDate) {
        query.dateTime = { $gte: startDate };
      }
    } else {
      const allProduct = await Product.find({ sellerId });
      const productIds = allProduct.map((product) => product._id);
      query = {
        productId: { $in: productIds },
      };
    }

    const allFeedback = await Feedback.find(query);
    let ratingCount = 0,
        reviewCount = 0,
        totalRating = 0;

    allFeedback.forEach(({ rating, review }) => {
      if (rating) {
        ratingCount++;
        totalRating += rating;
      }
      if (review) reviewCount++;
    });

    const paginatedFeedback = await Feedback.find(query)
      .skip(offset)
      .limit(limit)
      .populate("userId", "firstName lastName phoneNumber profilePic");
     

    const totalReview = allFeedback.length;

    return res.status(statusCode.OK).json({
      success: true,
      data: paginatedFeedback.map((feedback) => ({
        ...feedback.toObject(),
        comment: feedback.comment|| "",  
        feedbackId: feedback._id.toString(), 
      })),
      totalRating: totalReview,
      totalReview: reviewCount,
      averageRating: ratingCount ? Number((totalRating / ratingCount).toFixed(1)) : 0,
      currentPage: page,
      totalPages: Math.ceil(totalReview / limit),
      message: `Feedbacks of this product for ${timeRange}.`,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

