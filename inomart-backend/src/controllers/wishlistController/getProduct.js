import { statusCode } from "../../config/constant.js";
import wishlist from "../../models/cart/wishlistSchema.js";

export const productsFromWishlist = async (req, res) => {
  try {
    const { userId } = req.body;
    const existingItems = await wishlist.find({ userId }).populate('productId');
    if (!existingItems || existingItems.length === 0) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No products found in wishlist",
      });
    }

    const uniqueProducts = existingItems.map(item => {
      const product = item.productId; 
      const variation = product.variation?.id(item.variationId); 

      return {
        productId: product._id,
        productName: product.productName,
        brandName: product.brandName,
        description: product.description,
        regularPrice: variation ? variation.regularPrice : null,
        sellingPrice: variation ? variation.sellingPrice : null,
        discountType: variation ? variation.discountType : null,
        discount: variation ? variation.discount : null,
        stock: variation ? variation.stock : null,
        skuId: variation ? variation.skuId : null,
        productImages: product.productImages,
        productVideo: product.productVideo,
        barcode: product.barcode,
        weight: product.weight,
        dimensions: product.dimensions,
        variationId: item.variationId 
      };
    });

    return res.status(statusCode.OK).json({
      success: true,
      message: "Products fetched",
      data: uniqueProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};