import { statusCode } from "../../config/constant.js";
import Business from "../../models/business/businessSchema.js";

export const checkSellerHasBusiness = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const checkBusiness = await Business.find({ sellerId }).sort({_id:1});
    if (checkBusiness.length === 0)
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "User has no business.",
      });
    return res.status(statusCode.OK).json({
      success: true,
      status: checkBusiness[0].status,
      message: `User has ${checkBusiness.length} business.`,
      data : checkBusiness[0],
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
