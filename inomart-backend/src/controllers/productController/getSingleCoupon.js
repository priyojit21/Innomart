import { statusCode } from "../../config/constant.js";
import couponSchema from "../../models/product/couponSchema.js";

export const singleCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const myCoupon = await couponSchema.findById({ _id: couponId });
    return res.status(statusCode.ACCEPTED).json({
      success: true,
      message: "Coupon Fetched Success",
      data: myCoupon,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
