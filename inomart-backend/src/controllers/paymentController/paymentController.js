import { instance } from "../../../server.js";
import crypto from "crypto";
import Payment from "../../models/order/paymentSchema.js";
import Order from "../../models/order/orderSchema.js";
import { statusCode } from "../../config/constant.js";
import cartSchema from "../../models/cart/cartSchema.js";
import orderItemSchema from "../../models/order/orderItemSchema.js";
import userSchema from "../../models/users/userSchema.js";
import Product from "../../models/product/productSchema.js";

//creating order
export const checkOut = async (req, res) => {
  try {
    const { userId } = req.body;
    const { orderId } = req.params;
    const options = {
      amount: Number(req.body.amount * 100), //converting to Rs from paisa
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    let order;

    try {
      order = await instance.orders.create(options);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    await Order.findByIdAndUpdate(orderId, { totalAmount: options.amount });

    let myCart = await cartSchema.find({ userId });

    const varIds = myCart.map(item => item.variationId);

    myCart.map(item => item.quantity);

    const myProd = await Product.aggregate([
      { $unwind: "$variation" },
      { $match: { "variation._id": { $in: varIds } } },
      { $project: { _id: 1, "variation": 1 } }
    ]);


    for (let i = 0; i < myCart.length; i++) {
      const cartItem = myCart[i];
      const product = myProd.find(prod => prod.variation._id.toString() === cartItem.variationId.toString());
      if (product) {
        const newStock = product.variation.stock - cartItem.quantity;
        if (newStock < 0) {
          console.error(`Insufficient stock for variation ${cartItem.variationId}. Current stock: ${product.variation.stock}, Requested: ${cartItem.quantity}`);
          return res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: "Insufficient stock Quantity",
            data: cartItem.variationId,
          });
        }
      }
    }

    try {
      await Payment.create({
        userId: userId,
        orderId: orderId,
        razorpayOrderId: order.id,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(statusCode.OK).json({
      success: true,
      message: "Success",
      order,
      userId,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const userId = req.params.id;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = "Success";

    let myCart = await cartSchema.find({ userId });

    const varIds = myCart.map(item => item.variationId);

    myCart.map(item => item.quantity);

    const myProd = await Product.aggregate([
      { $unwind: "$variation" },
      { $match: { "variation._id": { $in: varIds } } },
      { $project: { _id: 1, "variation": 1 } }
    ]);


    for (let i = 0; i < myCart.length; i++) {
      const cartItem = myCart[i];
      const product = myProd.find(prod => prod.variation._id.toString() === cartItem.variationId.toString());
      if (product) {
        const newStock = product.variation.stock - cartItem.quantity;
        if (newStock < 0) {
          console.error(`Insufficient stock for variation ${cartItem.variationId}. Current stock: ${product.variation.stock}, Requested: ${cartItem.quantity}`);
          return res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: "Insufficient stock Quantity",
          });
        }
        // Update the product stock in the database
        await Product.updateOne(
          { "variation._id": cartItem.variationId },
          { $set: { "variation.$.stock": newStock } }
        );
        console.log(`Updated stock for variation ${cartItem.variationId}: ${newStock}`);
      } else {
        console.error(`Product with variation ID ${cartItem.variationId} not found.`);
      }
    }
    await cartSchema.deleteMany({ userId });

    await cartSchema.find({ userId });

    await orderItemSchema.updateMany(
      { userId: userId, paymentId: null },
      { $set: { paymentId: payment._id } }
    );

    await payment.save();

    await userSchema.findByIdAndUpdate(userId, { $inc: { buyCount: 1 } });

    res.redirect(
      `http://localhost:5173/paymentSuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(statusCode.UNAUTHORIZED).json({
      success: false,
      message: "Payment Failed",
    });
  }
};

export const paymentFailed = async (req, res) => {
  const { razorpay_order_id, userId } = req.body;

  try {
    // Find the payment document by order ID
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (payment) {
      // Update the payment status to "Failed"
      payment.status = "Failed";
      await payment.save();
      await orderItemSchema.updateMany(
        { userId: userId, paymentId: null },
        { $set: { paymentId: payment._id } }
      );
      return res.status(statusCode.OK).json({
        success: true,
        message: "Payment status updated to failed",
      });
    } else {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Payment record not found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPaymentKey = async (req, res) => {
  try {
    return res.status(statusCode.OK).json({
      success: true,
      message: "Key fetch success",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
