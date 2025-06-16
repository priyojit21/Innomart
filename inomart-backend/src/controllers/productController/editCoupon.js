import { statusCode } from "../../config/constant.js";
import couponSchema from "../../models/product/couponSchema.js";
import productSchema from "../../models/product/productSchema.js";

export const editCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const {
      code,
      amount,
      userId,
      product,
      category,
      isActive,
      minAmount,
      offerType,
      isFirstTime,
      offerDetails,
      customerLimit,
      validFromDateTime,
      validTillDateTime,
    } = req.body;

    for (const _id of product) {
      const productValue = await productSchema.findOne({
        _id,
        sellerId: userId,
      });
      if (!productValue) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Product not found",
        });
      }
    }

    const existingCouponCode = await couponSchema.findOne({
      code,
      _id: { $ne: couponId },
    });

    if (existingCouponCode) {
      return res.status(statusCode.CONFLICT).json({
        success: false,
        message: "Coupon Code Already Exists",
      });
    }

    const updatedCoupon = await couponSchema.findByIdAndUpdate(
      couponId,
      {
        code,
        amount,
        userId,
        product,
        isActive,
        category,
        minAmount,
        offerType,
        isFirstTime,
        offerDetails,
        customerLimit,
        validFromDateTime,
        validTillDateTime,
      },
      { new: true }
    );

    return res.status(statusCode.CREATED).json({
      success: true,
      message: "Coupon Updated Successfully.",
      coupon: updatedCoupon,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
