import { statusCode } from "../config/constant.js";

export const userAuthentication = (req, res, next) => {
  try {
    const { role } = req.body;
    if (role === "Customer") {
      next();
    } else {
      return res.status(statusCode.UNAUTHORIZED).json({
        success: false,
        message: "User lacks authorization.",
      });
    }
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};
