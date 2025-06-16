import Order from "../models/order/orderSchema.js";
import OrderItem from "../models/order/orderItemSchema.js";
import Product from "../models/product/productSchema.js";
import BusinessAddress from "../models/business/businessAddressSchema.js";
import Business from "../models/business/businessSchema.js";
import { statusCode } from "../config/constant.js";
import Payment from '../models/order/paymentSchema.js';
import { mailSender } from "../controllers/mailSenderController/mailSender.js";
import User from '../models/users/userSchema.js';

export const generateInvoice = async (req, res) => {
  try {
    const id = req.params.orderId;
    const Invoice = "Invoice_" + id;

    const userId = req.body?.userId;
    console.log(userId);


    const findOrder = await Order.findById(id);
    const totalAmount = (findOrder.totalAmount) / 100;
    const myUser = findOrder.userId;

    const user = await User.findById(myUser);

    const payId = await Payment.findOne({ orderId: findOrder._id });

    if (!payId || payId.status !== "Success") {
      return res.status(400).json({ message: "Payment not successful. Invoice not generated." });
    }

    const myPaymentId = payId._id;

    const orderItems = await OrderItem.find({
      userId: myUser,
      paymentId: myPaymentId,
    });

    const productIds = orderItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const sellerIds = products.map((product) => product.sellerId);
    const sellerBusiness = await Business.find({ sellerId: { $in: sellerIds } });

    const businessIds = sellerBusiness.map((item) => item._id);
    const sellerAddress = await BusinessAddress.find({ businessId: { $in: businessIds } });

    let randomAddress = {};
    if (sellerAddress.length > 0) {
      const randomIndex = Math.floor(Math.random() * sellerAddress.length);
      randomAddress = sellerAddress[randomIndex]?.toObject?.() || {};
    }

    const items = orderItems.map((orderItem) => {
      const matchingProduct = products.find(p => p._id.toString() === orderItem.productId.toString());
      const name = matchingProduct ? matchingProduct.productName : "Product";
      const quantity = orderItem.quantity;
      const price = orderItem.price;
      const total = price * quantity;
      return { name, quantity, price, total };
    });

    const formattedTotal = `₹${totalAmount.toLocaleString("en-IN")}`;

    const invoiceBill = {
      InvoiceId: Invoice,
      GrandTotal: formattedTotal,
      BillingAddress: randomAddress,
      items,
    };

    const mailObject = {
      email: user.email,
      subject: "Your Invoice",
      template: "invoice",
      context: {
        InvoiceId: Invoice,
        GrandTotal: formattedTotal,
        BillingAddress: randomAddress,
        items,
        name: `${user.firstName} ${user.lastName}`,
        date: new Date().toLocaleDateString("en-IN"),
      },
    };

    await mailSender(mailObject);

    return res.status(statusCode.ACCEPTED).json({
      success: true,
      message: "Invoice Generated",
      data: invoiceBill,
    });

  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
