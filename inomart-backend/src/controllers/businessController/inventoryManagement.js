import { statusCode } from "../../config/constant.js";
import productSchema from "../../models/product/productSchema.js";

export const inventoryManagement = async (req, res) => {
  try {
    let inStock = 0,
      lowStock = 0,
      outOfStock = 0,
      totalStock = 0,
      totalProduct = 0;
    const { sellerId } = req.body;
    const products = await productSchema.find({ sellerId });
    products.forEach(product => {
      totalProduct += product.variation.length;
      for (let i = 0; i < product.variation.length; i++) {
        totalStock += product.variation[i].stock;
        if (product.variation[i].stock === 0)
          outOfStock++;
        else if (product.variation[i].stock > 5)
          inStock++;
        else
          lowStock++;
      }
    });

    res.status(statusCode.OK).json({
      success: true,
      totalProduct: totalProduct,
      inStock: inStock,
      lowStock: lowStock,
      outOfStock: outOfStock,
      totalStock: totalStock
    });
  }
  catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};