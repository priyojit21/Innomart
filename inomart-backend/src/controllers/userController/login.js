import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
dotenv.config();

import Users from "../../models/users/userSchema.js";
import { statusCode } from "../../config/constant.js";
import session from "../../models/users/sessionSchema.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // user is not present
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(statusCode.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      // user's password not matching
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(statusCode.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized Access",
        });
      } else if (passwordMatch && user.isVerified === true) {
        await session.findOneAndDelete({ userId: user._id });
        await session.create({ userId: user._id });

        const accessToken = jwt.sign(
          {
            id: user._id,
            role: user.role,
          },
          process.env.SECRET_KEY,
          { expiresIn: "10hr" }
        );
        const refreshToken = jwt.sign(
          {
            id: user._id,
            role: user.role,
          },
          process.env.SECRET_KEY,
          { expiresIn: "30days" }
        );
        return res.status(statusCode.OK).json({
          success: true,
          message: "User logged In",
          accessToken: accessToken,
          refreshToken: refreshToken,
          data: {
            username: user.firstName,
            email: user.email,
            role: user.role,
            defaultAddressId: user.defaultAddressId,
          },
        });
      }
      //user not verified
      else {
        res.status(statusCode.FORBIDDEN).json({
          message: "Complete Email verification before login",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
