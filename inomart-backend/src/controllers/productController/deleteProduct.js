import Product from "../../models/product/productSchema.js";
import { statusCode } from "../../config/constant.js";
import cartSchema from "../../models/cart/cartSchema.js";

export const deleteProduct = async (req, res) => {
  try {
    const { productIds, sellerId } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Product IDs must be provided as an array.",
      });
    }

    const existingProducts = await Product.find({
      _id: { $in: productIds },
      sellerId,
    });

    if (existingProducts.length !== productIds.length) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Some products not found or do not belong to the seller.",
      });
    }

    const response = await Product.deleteMany({
      _id: { $in: productIds },
    });

    // Delete related cart items
    const cartDeletion = await cartSchema.deleteMany({
      productId: { $in: productIds },
    });

    if (response.deletedCount) {
      return res.status(statusCode.OK).json({
        success: true,
        message: `${response.deletedCount} products deleted successfully. ${cartDeletion.deletedCount} related cart items removed.`,

      });
    }
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
