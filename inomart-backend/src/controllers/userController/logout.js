import sessionSchema from "../../models/users/sessionSchema.js";
import { statusCode } from "../../config/constant.js";

export const logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const existingSessions = await sessionSchema.find({ userId });
    if (existingSessions.length === 0) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "User  does not exist",
      });
    }

    const response = await sessionSchema.deleteMany({ userId });

    if (response.deletedCount > 0) {
      res.status(statusCode.ACCEPTED).json({
        success: true,
        message: "User  logged out successfully",
      });
    }
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
