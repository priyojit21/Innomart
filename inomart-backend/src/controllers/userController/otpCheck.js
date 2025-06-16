import { statusCode } from "../../config/constant.js";
import otpSchema from "../../models/otp/otpSchema.js";

export const otpCheck = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const user = await otpSchema.findOne({ email: email });
    if (!user) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }
    const otpCreatedAt = user.createdAt;
    const currentTime = new Date();
    const validTime = 5 * 60 * 1000;

    if (currentTime - otpCreatedAt.getTime() > validTime) {
      await otpSchema.deleteOne({ _id: user._id });
      return res.status(401).json({
        success: false,
        message: "OTP expired",
      });
    }
    if (user.otp === otp) {
      user.isVerified = true;
      await user.save();
      return res.status(statusCode.OK).json({
        success: true,
        message: "OTP verified successfully",
      });
    }
    return res.status(statusCode.UNAUTHORIZED).json({
      success: false,
      message: "Invalid OTP",
    });

  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
