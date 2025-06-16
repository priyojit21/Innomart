import Users from "../../models/users/userSchema.js";
import otpSchema from "../../models/otp/otpSchema.js";
import { mailSender } from "../mailSenderController/mailSender.js";

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User  not Registered",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const existingOtp = await otpSchema.findOne({ email });

    if (existingOtp) {
      existingOtp.isVerified = "false";
      existingOtp.otp = otp;
      existingOtp.createdAt = Date.now();
      await existingOtp.save();
    } else {
      await otpSchema.create({ email, otp });
    }

    try {
      await mailSender({
        email,
        subject: "Reset Password",
        template: "forgetPassword",
        context: {
          otp: otp,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
