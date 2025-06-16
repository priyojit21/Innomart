import UsersAddress from "../../models/users/userAddressSchema.js";
import Users from "../../models/users/userSchema.js";
import { statusCode } from "../../config/constant.js";
import orderItemSchema from "../../models/order/orderItemSchema.js";

export const deleteUserAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;
    const OrderAddress = await orderItemSchema.findOne({
      addressId: id,
    });

    if (OrderAddress) {
      const updatedAddress = await UsersAddress.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
        },
        { new: true }
      );

      if (!updatedAddress) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Address not found to delete",
        });
      }
      const user = await Users.findById(userId);

      if (user.defaultAddressId?.toString() === id) {
        const remainingAddresses = await UsersAddress.find({
          userId,
          isDeleted: false,
        });
        if (remainingAddresses.length > 0) {
          user.defaultAddressId = remainingAddresses[0]._id;
          await user.save();
        } else {
          user.defaultAddressId = null;
          await user.save();
        }
      }
      return res.status(statusCode.OK).json({
        success: true,
        message: "Address marked as deleted successfully",
        data: updatedAddress,
      });
    }

    const deleteAddress = await UsersAddress.findByIdAndDelete({ _id: id });

    if (!deleteAddress) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No Address Found",
      });
    }

    const user = await Users.findById(userId);

    if (user.defaultAddressId?.toString() === id) {
      const remainingAddresses = await UsersAddress.find({
        userId,
        isDeleted: false,
      });
      if (remainingAddresses.length > 0) {
        user.defaultAddressId = remainingAddresses[0]._id;
        await user.save();
      } else {
        user.defaultAddressId = null;
        await user.save();
      }
    }
    res.status(statusCode.OK).json({
      success: true,
      message: "Address Deleted successfully",
      data: deleteAddress,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
