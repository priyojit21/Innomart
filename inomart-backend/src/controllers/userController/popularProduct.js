import feedbackSchema from "../../models/product/feedbackSchema.js";
import { statusCode } from "../../config/constant.js";

export const popularProduct = async (req, res) => {
  try {
        await feedbackSchema
      .find({ rating: { $gte: "4" } })
      .populate({
        path: "productId",
        model: "Product",
        select: "productName brandName description productImages productVideo",
      })
      .limit(12);

    if (popularProduct.length === 0) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No products found",
      });
    } else {
      return res.status(statusCode.OK).json({
        success: true,
        message: "Products fetched",
        data: popularProduct,
      });
    }
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
