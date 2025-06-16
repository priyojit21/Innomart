import Product from "../../models/product/productSchema.js";
import { statusCode } from "../../config/constant.js";

export const deleteProductVideo = async (req, res) => {
  try {
    const productId = req.params.id;
    const videoUrl = req.body.videoUrl;

    if (!productId) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    if (!videoUrl) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Video URL is required.",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Product not found.",
      });
    }

    product.productVideo = "";
    await product.save();

    return res.status(statusCode.OK).json({
      success: true,
      message: "Product Video deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
