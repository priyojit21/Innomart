import { statusCode } from "../../config/constant.js";
import couponSchema from "../../models/product/couponSchema.js";
import productSchema from "../../models/product/productSchema.js";
import categorySchema from "../../models/product/categorySchema.js";
import userSchema from "../../models/users/userSchema.js";

export const getOrderCoupon = async (req, res) => {
  try {
    const { productIds, variationIds, categories, userId } = req.body;
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Product IDs are required.",
      });
    }
    const user = await userSchema.findById(userId);

    if (
      !variationIds ||
      !Array.isArray(variationIds) ||
      variationIds.length === 0
    ) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Variation IDs are required.",
      });
    }

    const categoryDocuments = await categorySchema.find({
      name: { $in: categories },
    });

    const categoryIds = categoryDocuments.map((category) => category._id);

    const variations = await productSchema.find(
      { "variation._id": { $in: variationIds } },
      { "variation.$": 1 }
    );

    const variationAmounts = {};
    variations.forEach((product) => {
      product.variation.forEach((variation) => {
        variationAmounts[variation._id] = variation.sellingPrice;
      });
    });

    const coupons = await couponSchema.find({
      $or: [
        { product: { $in: productIds } },
        { category: { $in: categoryIds } },
      ],
      isActive: true,
      customerLimit: { $gte: 1 },
    });

    const validCoupons = coupons.filter((coupon) => {
      return variationIds.some((variationId) => {
        const amount = variationAmounts[variationId];
        return amount && amount >= coupon.minAmount;
      });
    });

    return res.status(statusCode.OK).json({
      success: true,
      coupons: validCoupons,
      BuyerFirstPurchase: user.buyCount,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
