import { statusCode } from "../../config/constant.js";
import Business from "../../models/business/businessSchema.js";

export const editBusinessSchema = async (req, res) => {
  try {
    const { userId, description, governmentIdType } = req.body;
    const business = await Business.findOne({ sellerId: userId });

    if (description) {
      business.description = description;
    }
    if (governmentIdType) {
      business.governmentIdType = governmentIdType;
    }
    const status = business.status + 1;
    business.status = status;
    business.save();
    return res.status(statusCode.OK).json({
      success: true,
      message: "Edited success",
      data: status,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
