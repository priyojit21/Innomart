import { statusCode } from "../../config/constant.js";
import couponSchema from "../../models/product/couponSchema.js";
import productSchema from "../../models/product/productSchema.js";

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      amount,
      userId,
      product,
      isActive,
      category,
      sellerId,
      minAmount,
      offerType,
      isFirstTime,
      offerDetails,
      customerLimit,
      validFromDateTime,
      validTillDateTime,
    } = req.body;

    for (let index = 0; index < product.length; index++) {
      const productValue = await productSchema.findOne({
        _id: product[index],
        sellerId,
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
    });

    if (existingCouponCode) {
      return res.status(statusCode.CONFLICT).json({
        success: false,
        message: "Coupon Code Already Exists",
      });
    }

    const newCoupon = await couponSchema.create({
      userId,
      minAmount,
      validFromDateTime,
      validTillDateTime,
      offerDetails,
      offerType,
      code,
      amount,
      isActive,
      isFirstTime,
      customerLimit,
      product,
      category,
    });

    return res.status(statusCode.CREATED).json({
      success: true,
      message: "Coupon Created Successfully.",
      coupon: newCoupon,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
