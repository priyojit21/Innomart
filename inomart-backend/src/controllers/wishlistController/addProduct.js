import { statusCode } from "../../config/constant.js";
import wishlist from "../../models/cart/wishlistSchema.js";
import productSchema from "../../models/product/productSchema.js";

export const addProductToWishlist = async (req, res) => {
  try {
    const { userId, productId, variationId } = req.body;

    const itemPresent = await productSchema.findOne({ _id: productId });
    if (!itemPresent) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Product not present",
      });
    }

    const existingItem = await wishlist.findOne({ userId, productId, variationId });
    if (existingItem) {
      return res.status(statusCode.OK).json({
        success: true,
        message: "Product with this variation already exist in wishlist",
      });
    }

    const product = await productSchema.findById(productId);
    if (!product) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    const variation = product.variation.id(variationId);
    if (!variation) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Variation not found",
      });
    }

    await wishlist.create({
      userId,
      productId,
      variationId
    });

    return res.status(statusCode.CREATED).json({
      success: true,
      message: "Product added to wishlist",
    });
  } catch (error) {
    console.error(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};