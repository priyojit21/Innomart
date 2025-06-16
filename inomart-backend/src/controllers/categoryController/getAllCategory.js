import { statusCode } from "../../config/constant.js";
import Category from "../../models/product/categorySchema.js";

export const getAllCategory = async (req, res) => {
  try {
    const { parent } = req.body;
    
    const categories = await Category.find(
      parent ? { parent : {$in : parent} } : { parent: { $exists: false } }
    );

    if (categories.length === 0) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No categories found.",
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      message: `${categories.length} Categories found.`,
      data: categories,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
