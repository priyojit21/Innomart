import { statusCode } from "../../config/constant.js";
import couponSchema from "../../models/product/couponSchema.js";

export const getCoupon = async (req, res) => {
  try {
    const { sellerId} = req.body;

    const coupons = await couponSchema.find(sellerId ? { userId: sellerId } : {});

    const totalCoupons = await couponSchema.countDocuments(sellerId ? { userId: sellerId } : {});

    if (!coupons.length) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No coupons available.",
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      coupons,
      totalCoupons,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
