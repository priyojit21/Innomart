import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Users from "../models/users/userSchema.js";
import session from "../models/users/sessionSchema.js";
import { statusCode } from "../config/constant.js";
dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    jwt.verify(accessToken, process.env.SECRET_KEY, async (err, decoded) => {
      if (err)
        return res.status(statusCode.TOKEN_EXPIRED_OR_INVALID).json({
          success: false,
          message: err.message,
        });

      const targetUser = await Users.findOne({ _id: decoded.id });

      if (!targetUser)
        return res.status(statusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated.",
        });

      if (!targetUser.isVerified)
        return res.status(statusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not verified.",
        });

      const checkSession = await session.findOne({ userId: decoded.id });

      if (!checkSession)
        return res.status(statusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated.",
        });

      req.body.role = decoded.role;
      req.body.userId = decoded.id;

      if (decoded.role === "Seller") {
        req.body.sellerId = decoded.id;
      }
      next();
    });
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};
