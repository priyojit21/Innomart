import Product from "../../models/product/productSchema.js";
import { statusCode } from "../../config/constant.js";

export const uploadProductImages = async (req, res) => {
  try {
    const productId = req.params.id;
    

    if (!productId) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(statusCode.UNSUPPORTED_MEDIA_TYPE).send({
        success: false,
        message: "No product images uploaded. Please add images.",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Product not found.",
      });
    }

    const newImages = req.files.map((file) => {
      return `${process.env.BASE_URL}uploads/product/` + file.filename;
    });
    
    product.productImages = [...product.productImages, ...newImages];
    await product.save();

    return res.status(statusCode.OK).json({
      success: true,
      message: "Product images uploaded successfully.",
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