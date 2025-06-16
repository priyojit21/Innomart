import jwt from "jsonwebtoken";

import Users from "../models/users/userSchema.js";
import { statusCode } from "../config/constant.js";

export const verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        return res.status(statusCode.UNAUTHORIZED).json({
          error: "Verification failed. The link may be invalid or expired.",
        });
      }

      const id = decoded.userId;
      const findUser = await Users.findById(id);

      if (findUser) {
        if (findUser.isVerified) {
          return res
            .status(statusCode.OK)
            .json({ success: true, message: "Email already verified!" });
        }


        findUser.isVerified = true;
        await findUser.save();

        return res
          .status(statusCode.OK)
          .json({ success: true, message: "Email verified successfully!" });
      } else {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "User not found. Please register again.",
        });
      }
    });
  }
};
