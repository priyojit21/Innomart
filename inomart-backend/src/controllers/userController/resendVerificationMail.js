import jwt from "jsonwebtoken";
import Users from "../../models/users/userSchema.js";
import { statusCode } from "../../config/constant.js";
import { mailSender } from "../mailSenderController/mailSender.js";

export const resendVerificationMail = async (req, res) => {
  try {
    const { email } = req.body;
    const userPresent = await Users.findOne({ email });
    if (!userPresent)
      return res.status(statusCode.UNAUTHORIZED).json({
        success: false,
        message: "You are not registered.",
      });
    if (userPresent.isVerified)
      return res.status(statusCode.CONFLICT).json({
        success: false,
        message: "You are already verified.",
      });

    const token = jwt.sign(
      { userId: userPresent._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "10m",
      }
    );
    try {
      await mailSender(email, token);
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(statusCode.CREATED).json({
      success: true,
      message: "Verification mail has been successfully sent.",
    });
  } catch (err) {
    console.log(err);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};
