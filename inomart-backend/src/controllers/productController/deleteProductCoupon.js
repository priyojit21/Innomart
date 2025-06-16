import { statusCode } from "../../config/constant.js";
import couponSchema from "../../models/product/couponSchema.js";

export const deleteCoupon = async (req, res) => {
  try {
    const { userId } = req.body;
    const { couponId } = req.params;
    const coupon = await couponSchema.findOneAndDelete({ _id: couponId, userId });
    if (coupon) {
      return res.status(statusCode.OK).json({
        success: true,
        message: "Deleted Successfully"
      });
    }
    return res.status(statusCode.NOT_FOUND).json({
      success: false,
      message: "There is no such coupon"
    });
  }
  catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};