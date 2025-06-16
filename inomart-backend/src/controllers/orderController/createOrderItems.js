import cartSchema from "../../models/cart/cartSchema.js";
import { statusCode } from "../../config/constant.js";
import orderItemSchema from "../../models/order/orderItemSchema.js";
import orderSchema from "../../models/order/orderSchema.js";
import productSchema from "../../models/product/productSchema.js";
import userAddressSchema from "../../models/users/userAddressSchema.js";

export const createOrderItems = async (req, res) => {
  try {
    let totalAmount = 0;
    const { userId, cartIds, addressId } = req.body;

    const calculateDeliveryDate = (deliveryTimeStr) => {
      const match = deliveryTimeStr.match(/(\d+)-(\d+)_days/);
      if (match) {
        const maxDays = parseInt(match[2], 10);
        const resultDate = new Date();
        resultDate.setDate(resultDate.getDate() + maxDays);
        return resultDate;
      }
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      return defaultDate;
    };

    const cartItems = await cartSchema.find({
      _id: { $in: cartIds },
      userId: userId,
    });

    const exisitingOrderItems = await orderItemSchema.find({ paymentId: null });

    if (exisitingOrderItems.length > 0) {
      const idsToDelete = exisitingOrderItems.map(item => item._id);

      await orderItemSchema.deleteMany({ _id: { $in: idsToDelete } });

    } else {
      console.log("No existing unpaid order items to delete.");
    }

    const newOrderItems = cartItems.map((item) => {
      const { _id, ...remainingFields } = item._doc;
      console.log(_id);
      return {
        ...remainingFields,
        addressId,
      };
    });

    const address = await userAddressSchema.findById(addressId);
    if (!address) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "No address available to create an order.",
      });
    }

    if (cartItems.length === 0) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "No items in the cart to create an order.",
      });
    }

    const createdOrderItems = await orderItemSchema.insertMany(newOrderItems);

    for (const item of createdOrderItems) {
      const product = await productSchema.findById(item.productId);
      for (let i = 0; i < product.variation.length; i++) {
        if (
          product.variation[i]._id.toString() === item.variationId.toString()
        ) {
          item.price = product.variation[i].sellingPrice;
          item.deliverAt = calculateDeliveryDate(product.deliveryTime);
          await item.save();
          totalAmount = totalAmount + item.price * item.quantity;
        }
      }
    }

    const allOrder = await orderSchema.create({
      userId,
      totalAmount,
    });

    res.status(statusCode.CREATED).json({
      success: true,
      data: createdOrderItems,
      allOrder: allOrder,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
