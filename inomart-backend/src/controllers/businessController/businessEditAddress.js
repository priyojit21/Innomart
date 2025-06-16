import { statusCode } from "../../config/constant.js";
import BusinessAddress from "../../models/business/businessAddressSchema.js";
import businessSchema from "../../models/business/businessSchema.js";

export const editBusinessAddressController = async (req, res) => {
  try {
    const { businessId } = req.params;
    const {
      country,
      street,
      city,
      state,
      zipCode,
      addressProof,
      buildingNo,
      sellerId,
      address
    } = req.body;

    const existingBusinessAddress = await BusinessAddress.findOne({
      businessId,
    });

    const existingBusiness = await businessSchema.findOne({
      sellerId,
      _id: businessId,
    });

    if (!existingBusiness) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Business not found for this user",
      });
    }

    if (!existingBusinessAddress) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Business address not found.",
      });
    }

    const duplicateAddress = await BusinessAddress.findOne({
      street,
      city,
      state,
      zipCode,
      buildingNo,
      businessId,
    });

    if (duplicateAddress) {
      return res.status(statusCode.CONFLICT).json({
        success: false,
        message: "This business address Already Exists.",
      });
    }

    existingBusinessAddress.country = country;
    // existingBusinessAddress.street = street;
    // existingBusinessAddress.city = city;
    // existingBusinessAddress.state = state;
    existingBusinessAddress.state = address;
    existingBusinessAddress.zipCode = zipCode;
    existingBusinessAddress.addressProof = addressProof;
    existingBusinessAddress.buildingNo = buildingNo;

    const updatedBusinessAddress = await existingBusinessAddress.save();

    if (updatedBusinessAddress) {
      res.status(statusCode.OK).json({
        success: true,
        message: "Business address updated successfully.",
        data: updatedBusinessAddress,
      });
    } else {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update business address.",
      });
    }
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
