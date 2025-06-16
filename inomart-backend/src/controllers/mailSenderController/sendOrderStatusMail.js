import User from "../../models/users/userSchema.js";
import { mailSender } from "./mailSender.js";

export const sendOrderStatusMail = async (orderedItem, productName) => {
  try {
    const user = await User.findById(orderedItem.userId);
    let template = "";
    switch (orderedItem.status) {
      case "Pending":
        template = "OrderPending";
        break;
      case "Shipped":
        template = "orderShipped";
        break;
      case "Out For Delivery":
        template = "orderOutForDelivery";
        break;
      case "Delivered":
        template = "orderDelivered";
        break;
      case "Cancel":
        template = "orderCancelled";
        break;
      case "Refund":
        template = "orderRefund";
        break;
      default:
        break;
    }
    const mailConfiguration = {
      email: user.email,
      subject: "Order status",
      template,
      context: {
        productName,
      },
    };
    mailSender(mailConfiguration);
  } catch (error) {
    throw new Error(error.message);
  }
};
