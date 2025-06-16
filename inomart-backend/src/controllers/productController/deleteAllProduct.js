import productSchema from "../../models/product/productSchema.js";
import { statusCode } from "../../config/constant.js";
import cartSchema from "../../models/cart/cartSchema.js";

export const deleteAllProduct = async (req, res) => {
  try {
    const { sellerId, productIds } = req.body;

    const response = await productSchema.deleteMany({ sellerId });

    const cartDeletion = await cartSchema.deleteMany({
      productId: { $in: productIds },
    });

    if (!response.deletedCount) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No Product Found",
      });
    }

    res.status(statusCode.OK).json({
      success: true,
      message: `${response.deletedCount} products deleted successfully. ${cartDeletion.deletedCount} related cart items removed.`,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
