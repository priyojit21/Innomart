import userAddressSchema from "../../models/users/userAddressSchema.js";
import { statusCode } from "../../config/constant.js";

export const editUserAddress = async (req, res) => {
  try {
    const {
      userId,
      name,
      landMark,
      country,
      street,
      city,
      state,
      pinCode,
      type,
      houseNo,
    } = req.body;
    const { addressId } = req.params;

    const existingAddress = await userAddressSchema.findOne({
      userId,
      _id: addressId,
    });

    if (!existingAddress) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Address not found can't update",
      });
    }

    const duplicateAddress = await userAddressSchema.findOne({
      _id: { $ne: addressId },
      userId,
      street,
      country,
      name,
      landMark,
      state,
      houseNo,
      pinCode,
      city,
      type,
    });

    if (duplicateAddress) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "This address already exists",
      });
    }

    existingAddress.country = country;
    existingAddress.street = street;
    existingAddress.city = city;
    existingAddress.state = state;
    existingAddress.pinCode = pinCode;
    existingAddress.type = type;
    existingAddress.houseNo = houseNo;
    existingAddress.name = name;
    existingAddress.landMark = landMark;

    const updatedAddress = await existingAddress.save();

    if (updatedAddress) {
      res.status(statusCode.OK).json({
        success: true,
        message: "User  address updated successfully",
        data: updatedAddress,
      });
    }
  } catch (error) {
    console.error("Edit User Address Controller Error:", error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
