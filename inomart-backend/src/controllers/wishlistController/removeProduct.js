import { statusCode } from "../../config/constant.js";
import wishlist from "../../models/cart/wishlistSchema.js";

export const removeProductFromWishlist = async (req, res) => {
  try {
    const { userId } = req.body;
    const { productId, variationId } = req.params;
    const deleteFromWishlist = await wishlist.deleteOne({
      userId,
      productId,
      variationId,
    });

    if (deleteFromWishlist.deletedCount > 0)
      return res.status(statusCode.CREATED).json({
        success: true,
        message: "Product removed from wishlist",
      });

    return res.status(statusCode.NOT_FOUND).json({
      success: false,
      message: "Product not present",
    });
  } catch (error) {
    console.error(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
