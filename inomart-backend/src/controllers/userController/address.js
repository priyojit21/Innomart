import userAddressSchema from "../../models/users/userAddressSchema.js";
import Users from "../../models/users/userSchema.js";
import { statusCode } from "../../config/constant.js";

export const userAddressController = async (req, res) => {
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

    const existingUser = await Users.findById(userId);

    if (!existingUser) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    const existingAddress = await userAddressSchema.findOne({
      userId,
      street,
      country,
      state,
      houseNo,
      pinCode,
      city,
      type,
      name,
    });

    if (existingAddress) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "This address already exists",
      });
    }

    // Check if this is the first address
    const addressCount = await userAddressSchema.countDocuments({ userId ,isDeleted:false});

    const userAddress = await userAddressSchema.create({
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
      createdAt: Date.now(),
    });

    // If this is the first address, update user's default address
    if (addressCount === 0 && userAddress?._id) {
      existingUser.defaultAddressId = userAddress._id;
      await existingUser.save();
    }

    if (userAddress) {
      return res.status(statusCode.CREATED).json({
        success: true,
        message: "User address created successfully",
        data: userAddress,
        isDefault: addressCount === 0,
      });
    } else {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create user address",
      });
    }
  } catch (error) {
    console.error("User Address Controller Error:", error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
