import Users from "../../models/users/userSchema.js";
import bcrypt from "bcryptjs";
import otpSchema from "../../models/otp/otpSchema.js";

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const otp = await otpSchema.findOne({ email: email });
    if (otp) {
      if (otp.isVerified === true) {
        const user = await Users.findOne({ email });
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          return res.status(401).json({
            success: false,
            message: "Old Password, new Password same",
          });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.save();
        await otpSchema.findByIdAndDelete(otp._id);
        return res.status(200).json({
          success: true,
          message: "password updated",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Otp not verified",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Otp does not exist",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};