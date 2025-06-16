import { statusCode } from "../../config/constant.js";
import userAddressSchema from "../../models/users/userAddressSchema.js";

export const getAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    const address = await userAddressSchema.find({ userId ,isDeleted:false}).populate("userId","defaultAddressId");

    if (address)
      return res.status(statusCode.OK).json({
        success: true,
        message: "Address Fetch Success",
        data: address,
      });
    return res.status(statusCode.NOT_FOUND).json({
      success: false,
      message: "User not found",
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOneAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;
    const myAddress = await userAddressSchema.findById({ userId, _id: id });
    if (!myAddress) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Address Not Found",
      });
    }

    return res.status(statusCode.ACCEPTED).json({
      success: true,
      message: "Address Found",
      data: myAddress,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
