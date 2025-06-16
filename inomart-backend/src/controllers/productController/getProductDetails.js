import Product from "../../models/product/productSchema.js";
import { statusCode } from "../../config/constant.js";

export const getProductDetails = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const findProduct = await Product.find(sellerId ? { sellerId } : {}, { sellerId: 0 });
    if (findProduct) {
      return res.status(statusCode.ACCEPTED).json({
        success: true,
        message: "All Products Fetched Successfully",
        data: findProduct,
      });
    }
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
