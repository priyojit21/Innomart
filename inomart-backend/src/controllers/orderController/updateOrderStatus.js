import { statusCode } from "../../config/constant.js";
import orderItemSchema from "../../models/order/orderItemSchema.js";
import productSchema from "../../models/product/productSchema.js";
import { sendOrderStatusMail } from "../mailSenderController/sendOrderStatusMail.js";

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, sellerId } = req.body;

    if (!orderId || !status) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Order ID and status are required.",
      });
    }
    const order = await orderItemSchema.findById(orderId);
    
    if (!order) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Order not found.",
      });
    }
    
    const product = await productSchema.findById(order.productId);

    if (product.sellerId.toString() !== sellerId) {
      return res.status(statusCode.FORBIDDEN).json({
        success: false,
        message: "You are not authorized to update this order.",
      });
    }

    order.status = status;
    const updatedOrder = await order.save();
    sendOrderStatusMail(updatedOrder, product.productName);
    return res.status(statusCode.OK).json({
      success: true,
      data: updatedOrder,
      message: "Order status updated successfully.",
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
