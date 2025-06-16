import { statusCode } from "../../config/constant.js";
import orderItemSchema from "../../models/order/orderItemSchema.js";
import productSchema from "../../models/product/productSchema.js";
import userSchema from "../../models/users/userSchema.js";
import { mailSender } from "../mailSenderController/mailSender.js";

export const returnAndCancelItems = async (req, res) => {
  try {
    const { userId, reason, orderItemId, comment } = req.body;
    const orderItem = await orderItemSchema.findById(orderItemId);
    console.log("or", orderItem);
    const productId = orderItem.productId;
    const productItem = await productSchema.findById(productId);
    console.log("pro", productItem);
    const sellerId = productItem.sellerId;
    const seller = await userSchema.findById(sellerId);
    const email = seller.email;
    const user = await userSchema.findById(userId);
    let subject, template;
    if (!orderItem) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Order not found.",
      });
    }
    if (orderItem.status === "delivered") {
      subject = "Return requested";
      template = "return";
    } else {
      subject = "Cancel requested";
      template = "cancel";
    }
    const mailObject = {
      email,
      subject,
      template,
      context: {
        userName: user.firstName + " " + user.lastName,
        productName: productItem.productName,
        reason: reason,
        comment: comment,
      },
    };
    if (orderItem.status === "Cancel Initiated") {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Already Cancellation Initiated",
      });
    }
    try {
      await mailSender(mailObject);
      orderItem.status = "Cancel Initiated";
      await orderItem.save();
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
    res.status(statusCode.OK).json({
      success: true,
      message: "Mail sent to the seller",
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
