import { statusCode } from "../../config/constant.js";
import Category from "../../models/product/categorySchema.js";

export const addCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const formatName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const existingCategory = await Category.findOne({ name: formatName });
    if (existingCategory)
      return res.status(statusCode.CONFLICT).json({
        success: false,
        message: "This category is already exist.",
      });

    const newCategory = await Category.create({
      name: formatName,
      parent,
    });
    return res.status(statusCode.CREATED).json({
      success: true,
      message: "Successfully created new category.",
      data: newCategory,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
