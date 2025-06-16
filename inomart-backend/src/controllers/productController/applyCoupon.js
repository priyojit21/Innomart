import { statusCode } from "../../config/constant.js";
import couponSchema from "../../models/product/couponSchema.js";
import productSchema from "../../models/product/productSchema.js";
import categorySchema from "../../models/product/categorySchema.js";
import userSchema from "../../models/users/userSchema.js";

export const applyCoupon = async (req, res) => {
  try {
    const { totalAmount, code, productIds, variationIds, categories, userId } = req.body;

    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "User not found.",
      });
    }
    if (code === "FIRST001" || code === "LOYALTY100") {
      if (user.buyCount === 0 || user.buyCount > 3) {
        const discountAmount = (totalAmount * 30) / 100;
        const discountedAmount = totalAmount - discountAmount;

        return res.status(statusCode.OK).json({
          success: true,
          discountedAmount,
          message: `Special coupon applied. You saved ${discountAmount}.`,
        });
      } else {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "This coupon is not applicable for your purchase history.",
        });
      }
    }

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Product IDs are required.",
      });
    }

    if (!variationIds || !Array.isArray(variationIds) || variationIds.length === 0) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Variation IDs are required.",
      });
    }

    const coupon = await couponSchema.findOne({ code });

    if (!coupon) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    if (!coupon.isActive || coupon.customerLimit < 1) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Coupon is either inactive or usage limit reached.",
      });
    }

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

    const categoryDocs = await categorySchema.find({
      name: { $in: categories },
    });
    const categoryIds = categoryDocs.map((cat) => cat._id);

    const isCouponApplicable = (
      (coupon.product && coupon.product.some(pid => productIds.includes(String(pid)))) ||
      (coupon.category && coupon.category.some(cid => categoryIds.includes(String(cid))))
    );

    if (!isCouponApplicable) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "This coupon is not applicable for the selected products or categories.",
      });
    }


    const meetsMinAmount = variationIds.some((variationId) => {
      const amount = variationAmounts[variationId];
      return amount && amount >= coupon.minAmount;
    });

    if (!meetsMinAmount) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: `This coupon requires a minimum variation price of ${coupon.minAmount}.`,
      });
    }


    let discountAmount = 0;

    if (coupon.offerType === "percentage") {
      discountAmount = (totalAmount * coupon.amount) / 100;
    } else if (coupon.offerType === "flat") {
      discountAmount = coupon.amount;
    } else {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Invalid offer type.",
      });
    }

    const discountedAmount = totalAmount - discountAmount;

    return res.status(statusCode.OK).json({
      success: true,
      discountedAmount,
      message: `Coupon applied successfully. You saved ${discountAmount}.`,
    });

  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
