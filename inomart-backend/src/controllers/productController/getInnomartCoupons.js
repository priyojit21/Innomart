import { statusCode } from "../../config/constant.js";
import couponSchema from "../../models/product/couponSchema.js";

export const getInnomartCoupons = async (req, res) => {
  try {
    const coupons = await couponSchema.find({ isActive: true });

    if (!coupons.length) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No coupons available.",
      });
    }

    const sortedCoupons = coupons.sort((a, b) => b.amount - a.amount);

    const topCoupons = sortedCoupons.slice(0, 4);

    const promotionalTexts = topCoupons.map(coupon => {
      if (coupon.offerType === "percentage") {
        return `Grab upto ${coupon.amount}% off on selected Products`;
      } else if (coupon.offerType === "flat") {
        return `Save ₹${coupon.amount} on selected Products`;
      } else {
        return "Exclusive offer on selected Products";
      }
    });

    return res.status(statusCode.OK).json({
      success: true,
      topCoupons,
      promotionalTexts,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
