import Product from "../../models/product/productSchema.js";
import { statusCode } from "../../config/constant.js";

export const deleteProductImage = async (req, res) => {
  try {
    const productId = req.params.id;
    const imageUrl = req.body.imageUrl; 

    if (!productId) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    if (!imageUrl) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Image URL is required.",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (product.productImages.length <= 1) {
      return res.status(statusCode.FORBIDDEN).json({
        success: false,
        message: "Cannot delete the image. The product must have at least one image.",
      });
    }

    product.productImages = product.productImages.filter(image => image !== imageUrl);
    await product.save();

    return res.status(statusCode.OK).json({
      success: true,
      message: "Product image deleted successfully.",
      productImages: product.productImages,
    });
  } catch (error) {
    console.error(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};