import { statusCode } from "../../config/constant.js";
import Product from "../../models/product/productSchema.js";

export const lowStockProduct = async (req, res) => {
  try {
    const { sellerId } = req.body;

    // Fetch only the necessary fields
    const products = await Product.find(
      { sellerId: sellerId },
      { _id: 1, productName: 1, productImages: 1, variation: 1 }
    );

    if (!products || products.length === 0) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "This seller has no products.",
      });
    }

    const lowStockItems = [];

    products.forEach((product) => {
      product.variation.forEach((variation) => {
        if (variation.stock <= 5) {
          lowStockItems.push({
            productId: product._id,
            productName: product.productName,
            productImage: product.productImages?.[0] || "",
            variationId: variation._id,
            stock: variation.stock,
          });
        }
      });
    });
    if (!lowStockItems || lowStockItems.length === 0) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No low stock products found.",
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      data: lowStockItems,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
