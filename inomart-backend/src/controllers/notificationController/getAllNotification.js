import { statusCode } from "../../config/constant.js";
import Notifications from "../../models/notification/notificationSchema.js";

export const getNotification = async (req, res) => {
  try {
    const { userId } = req.body;

    const notifications = await Notifications.find({ userId });
    const notification = notifications.map((notification) => notification.message);

    if (notifications) {
      return res.status(statusCode.OK).json({
        success: true,
        notification: notification,
        message: "Fetched Successfully",
      });
    }
    return res.status(statusCode.NOT_FOUND).json({
      success: false,
      message: "No Notification Found",
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
