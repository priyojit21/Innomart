import Product from "../../models/product/productSchema.js";
import { statusCode } from "../../config/constant.js";

export const updateProductStatus = async (req, res) => {
  try {
    const { productIds, sellerId,status } = req.body;

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



    await Product.updateMany(
      { _id: { $in: productIds }, sellerId },
      { $set: { isEnabled: status } }
    );

    return res.status(statusCode.OK).json({
      success: true,
      message: `Products ${status ? "enabled" : "disabled"} successfully.`,
    });
  } catch (error) {
    console.error("Error updating product status:", error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
