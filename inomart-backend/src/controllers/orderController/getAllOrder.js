import { statusCode } from "../../config/constant.js";
import productSchema from "../../models/product/productSchema.js";
import orderItemSchema from "../../models/order/orderItemSchema.js";
import userSchema from "../../models/users/userSchema.js";

export const getOrderItems = async (req, res) => {
  try {
    const { sellerId, role, userId } = req.body;
    const { status, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const searchBy = req.query.searchBy || "firstName";
    const sortField = req.query.sortField || "orderAt";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    const query = {};

    if (role === "Seller") {
      const products = await productSchema.find({ sellerId });

      if (products.length === 0) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "No products are there for this seller",
        });
      }

      const productIds = products.map((product) => product._id);

      query.productId = { $in: productIds };
    } else {
      query.userId = userId;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [];

      if (searchBy === "firstName") {
        const userIds = await userSchema
          .find({ firstName: regex })
          .distinct("_id");
        query.userId = { $in: userIds };
      } else if (searchBy === "productName") {
        const productIds = await productSchema
          .find({ productName: regex })
          .distinct("_id");
        query.productId = { $in: productIds };
      }
    }

    const allOrders = await orderItemSchema
      .find({
        ...query,
        paymentId: { $ne: null },
      })
      .sort({ [sortField]: sortOrder })
      .populate("userId", "firstName")
      .populate("productId", "productName tags productImages description")
      .populate("addressId")
      .populate("paymentId", "status")
      .exec();

    const filteredOrders = allOrders.filter((order) =>
      role === "Seller"
        ? order.paymentId?.status === "Success"
        : ["Success", "Failed"].includes(order.paymentId?.status)
    );
    const paginatedOrders = filteredOrders.slice(offset, offset + limit);

    res.status(statusCode.OK).json({
      success: true,
      data: paginatedOrders,
      totalOrders: filteredOrders.length,
      currentPage: page,
      totalPages: Math.ceil(filteredOrders.length / limit),
      message:
        paginatedOrders.length > 0 ? "Ordered Items" : "No Ordered Items",
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
