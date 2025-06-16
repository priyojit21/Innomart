import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import Users from "../../models/users/userSchema.js";
import { statusCode } from "../../config/constant.js";
import { mailSender } from "../mailSenderController/mailSender.js";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role ,phoneNumber} = req.body;
    const existingUser = await Users.findOne({ email });
    const mailObject = {
      email,
      subject: "Email Verification",
      template: "email",
      context: {
        port: `${process.env.FRONTEND_PORT}`,
      },
    };
    if (existingUser) {
      if (!existingUser.isVerified) {
        const token = jwt.sign(
          { userId: existingUser._id },
          process.env.SECRET_KEY,
          {
            expiresIn: "10m",
          }
        );
        mailObject.context.token = token;
        try {
          await mailSender(mailObject);
        } catch (error) {
          return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
          });
        }

        return res.status(statusCode.OK).json({
          success: true,
          message:
            "User already exists but not verified. Verification email sent again.",
          token,
        });
      } else {
        return res.status(statusCode.BAD_REQUEST).json({
          error: "User is already registered and verified. Please log in.",
        });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      firstName,
      lastName,
      role,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    mailObject.context.token = token;
    try {
      await mailSender(mailObject);
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }

    res.status(statusCode.CREATED).json({
      success: true,
      message: "User registered successfully. Verification email sent.",
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
