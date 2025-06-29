import cartSchema from "../../models/cart/cartSchema.js";
import { statusCode } from "../../config/constant.js";

export const deleteCartItem = async (req, res) => {
  try {
    const { userId } = req.body;
    const { productId } = req.params;
    const { variationId } = req.params;

    const existingCartItem = await cartSchema.findOne({
      userId,
      productId,
      variationId,
    });

    if (!existingCartItem) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Product does not exist in cart",
      });
    }

    await cartSchema.findOneAndDelete({
      userId,
      productId,
      variationId,
    });

    return res.status(statusCode.OK).json({
      success: true,
      message: "Product completely removed from cart",
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
