import businessSchema from "../../models/business/businessSchema.js";
import { statusCode } from "../../config/constant.js";

export const sellerBusiness = async (req, res) => {
  try {
    const {
      userId,
      storeName,
      type,
      registrationNumber,
      // description,
      // businessLicense,
      // governmentIdType,
      // governmentId,
    } = req.body;

    const existingBusiness = await businessSchema.findOne({
      registrationNumber: req.body.registrationNumber,
      sellerId: userId,
    });

    if (existingBusiness) {
      return res.status(400).json({
        success: false,
        message: "Registration number already exist for this business",
      });
    }

    const existingBusinessByStoreName = await businessSchema.findOne({
      storeName: storeName,
    });

    if (existingBusinessByStoreName) {
      return res.status(400).json({
        success: false,
        message: "Store name already exists.",
      });
    }

    const newBusiness = await businessSchema.create({
      sellerId: userId,
      storeName,
      type,
      registrationNumber,
      // description,
      // businessLicense,
      // governmentIdType,
      // governmentId,
      createdAt: Date.now(),
    });

    if (newBusiness) {
      res.status(statusCode.CREATED).json({
        success: true,
        message: "Seller Business created successfully",
      });
    } else {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create Seller Business",
      });
    }
  } catch (error) {
    console.error("Business Controller Error:", error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
