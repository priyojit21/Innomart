dotenv.config();
import fs from "fs";
import dotenv from "dotenv";

import Users from "../../models/users/userSchema.js";
import { statusCode } from "../../config/constant.js";

// user profile picture
export const attachFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(statusCode.UNSUPPORTED_MEDIA_TYPE).send({
        success: false,
        message: "No file uploaded.",
      });
    }
    const data = await Users.findOne({ _id: req.body.userId });
    // remove the existing image from uploads folder as well
    if (data.profilePic !== "") {
      const oldFilePath = data.profilePic.replace(process.env.BASE_URL, "");
      fs.existsSync(oldFilePath) && fs.unlinkSync(oldFilePath);
    }
    data.profilePic =
      `${process.env.BASE_URL}uploads/user/` + req.file.filename;
    await data.save();
    res.status(statusCode.OK).json({
      success: true,
      message: "Profile Picture Added Successfully",
      profilePic: data.profilePic,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
