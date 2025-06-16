import ioClient from "socket.io-client";

import Cart from "../../models/cart/cartSchema.js";

export const sendNotification = async (product, accessToken) => {
  try {
    const socket = ioClient("http://localhost:3000", {
      extraHeaders: {
        authorization: accessToken,
      },
    });

    product.variation.forEach(async ({ _id, sellingPrice }) => {
      const cartItems = await Cart.find({ variationId: _id });
      cartItems.forEach((item) => {
        if (item.price > sellingPrice) {
          socket.emit("send_notification", {
            receiverId: item.userId,
            message: `🚨 Price Alert! The ${product.productName} you've been eyeing is now available at a lower price ${sellingPrice}. Hurry, check it out before it's gone!`,
          });
        }
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
