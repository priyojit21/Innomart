import { statusCode } from "../../config/constant.js";
import chatSchema from "../../models/chat/chatSchema.js";

export const getChat = async (req, res) => {
  try {

    const { senderId, receiverId } = req.body;
    await chatSchema.updateMany({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    },
      {
        $set: {
          status: "Read"
        }
      }
    );
    const chats = await chatSchema.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    });
    if (chats) {

      return res.status(statusCode.OK).json({
        success: true,
        data: chats,
        message: "Chats Fetched Successfully",
      });
    }
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};