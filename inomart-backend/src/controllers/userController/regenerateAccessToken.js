import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { statusCode } from "../../config/constant.js";

export const regenerateAccessToken = (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err)
        return res.json({
          status: statusCode.BAD_REQUEST,
          message: err.message,
          success: false,
        });
      const { id, role } = decoded;

      const accessToken = jwt.sign({ id, role }, process.env.SECRET_KEY, {
        expiresIn: "10hr",
      });

      const refreshToken = jwt.sign({ id, role }, process.env.SECRET_KEY, {
        expiresIn: "30days",
      });

      return res.json({
        status: statusCode.CREATED,
        accessToken,
        refreshToken,
        message: "Successfully generate new access & refresh token.",
        success: true,
      });
    });
  } catch (err) {
    return res.json({
      status: statusCode.INTERNAL_SERVER_ERROR,
      message: err.message,
      success: false,
    });
  }
};
