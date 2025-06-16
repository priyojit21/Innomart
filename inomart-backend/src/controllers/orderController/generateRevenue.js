import { statusCode } from "../../config/constant.js";
import orderItemSchema from "../../models/order/orderItemSchema.js";
import productSchema from "../../models/product/productSchema.js";

export const generateRevenue = async (req, res) => {
  try {
    let revenue = 0;
    let completed = 0;
    let pending = 0;
    let cancelled = 0;
    let startDate = new Date();
    const { sellerId, timeRange } = req.body;

    const products = await productSchema.find({ sellerId });

    const productIds = products.map((product) => product._id);

    switch (timeRange) {
      case "daily":
        startDate.setHours(0, 0, 0, 0);
        break;

      case "weekly":
        startDate.setDate(startDate.getDate() - 7);
        break;

      case "monthly":
        startDate.setDate(startDate.getDate() - 30);
        break;

      default:
        startDate = null;
    }
    const query = {
      productId: { $in: productIds },
    };
    if (startDate) {
      query.orderAt = { $gte: startDate };
    }

    const allOrderItems = await orderItemSchema.find(query);

    allOrderItems.forEach(({ status, price, quantity }) => {
      if (status === "Delivered") {
        completed++;
        revenue += price * quantity;
      }
      if (status === "Pending") pending++;
      if (status === "Cancel") cancelled++;
    });

    return res.status(statusCode.OK).json({
      success: "true",
      totalRevenue: revenue,
      totalOrders: allOrderItems.length,
      pending,
      completed,
      cancelled,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
