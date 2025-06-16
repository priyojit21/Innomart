import { statusCode } from "../../config/constant.js";
import userAddressSchema from "../../models/users/userAddressSchema.js";
import userSchema from "../../models/users/userSchema.js";

export const makeDefaultAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.body;

    // Basic validation for missing parameters
    if (!userId || !addressId) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "User ID and Address ID are required",
      });
    }

    // Check if the address exists and belongs to the correct user
    const address = await userAddressSchema.findById(addressId);
    if (!address || address.userId.toString() !== userId) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "This user has no such address",
      });
    }

    // Fetch the user
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No such user found",
      });
    }

    // If the address is already the default, remove it
    const currentDefaultAddressId = user.defaultAddressId?.toString();
    if (currentDefaultAddressId === addressId) {
      await userSchema.findByIdAndUpdate(userId, {
        $unset: { defaultAddressId: "" },
      });

      return res.status(statusCode.OK).json({
        success: true,
        message: "Default address has been removed",
        defaultAddressId: null,
      });
    }

    // Update to new default address
    user.defaultAddressId = addressId;
    await user.save();

    return res.status(statusCode.OK).json({
      success: true,
      message: "Default address updated successfully",
      defaultAddressId: addressId,
    });
  } catch (error) {
    console.error(error); // Helpful for debugging
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
