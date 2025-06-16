import Product from "../../models/product/productSchema.js";
import { statusCode } from "../../config/constant.js";

export const fetchAllDrafts = async (req, res) => {
  try {
    const { sellerId, isDraft } = req.body;

    if (!sellerId || typeof isDraft !== "boolean") {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Both sellerId and isDraft (true/false) are required.",
      });
    }

    const drafts = await Product.find({ sellerId, isDraft });

    return res.status(statusCode.OK).json({
      success: true,
      message: "Draft products fetched successfully.",
      data: drafts,
    });
  } catch (error) {
    console.error("Error fetching drafts:", error.message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error while fetching drafts.",
    });
  }
};
