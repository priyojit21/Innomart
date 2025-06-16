import orderItemSchema from "../../models/order/orderItemSchema.js";
import { statusCode } from "../../config/constant.js";
import productSchema from "../../models/product/productSchema.js";

export const topSellingProduct = async (req, res) => {
  try {
    let startDate = new Date();
    const { sellerId, timeRange } = req.body;


    const products = await productSchema.find({ sellerId });
    const productIds = products.map((product) => product._id);

    if (productIds.length === 0) {
      return res.status(statusCode.OK).json({
        success: true,
        message: "No products found for this seller.",
        topSellingProducts: [],
      });
    }


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
      case "overall":
      default:
        startDate = null;
    }


    const query = {
      productId: { $in: productIds },
      status: "Delivered",
    };
    if (startDate) {
      query.orderAt = { $gte: startDate };
    }

    // This MongoDB aggregation pipeline retrieves the top 10 best-selling products based on the number of times each product appears in the order items collection. It begins by filtering the data using a given query, then groups the results by productId, counting how many times each product was ordered. The grouped products are sorted in descending order of order count, and the top 10 are selected. A $lookup stage joins each product with its details from the products collection, followed by $unwind to flatten the joined data. Finally, the $project stage formats the output to include the product ID, order count, product name, brand name, the first product image, and the first selling price from the product’s variation data. This provides a concise summary of the most popular products along with key details for display or analysis.



    const topSelling = await orderItemSchema.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$productId",
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { orderCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          productId: "$_id",
          orderCount: 1,
          productName: "$productDetails.productName",
          productImage: {
            $arrayElemAt: ["$productDetails.productImages", 0],
          },
          sellingPrice: {
            $arrayElemAt: ["$productDetails.variation.sellingPrice", 0],
          },
          _id: 0,
        },
      },
    ]);

    return res.status(statusCode.OK).json({
      success: true,
      timeRange,
      topSellingProducts: topSelling,
    });
  } catch (error) {
    // console.error("Top Selling Product Error:", error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

//overall Top Selling Product
export const OverallTopSellingProduct = async (req, res) => {
  try {
    let startDate = new Date();
    const { timeRange } = req.body;


    const products = await productSchema.find();
    const productIds = products.map((product) => product._id);

    if (productIds.length === 0) {
      return res.status(statusCode.OK).json({
        success: true,
        message: "No products found for this seller.",
        topSellingProducts: [],
      });
    }


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
      case "overall":
      default:
        startDate = null;
    }


    const query = {
      productId: { $in: productIds },
      status: "Delivered",
    };
    if (startDate) {
      query.orderAt = { $gte: startDate };
    }

    // This MongoDB aggregation pipeline retrieves the top 10 best-selling products based on the number of times each product appears in the order items collection. It begins by filtering the data using a given query, then groups the results by productId, counting how many times each product was ordered. The grouped products are sorted in descending order of order count, and the top 10 are selected. A $lookup stage joins each product with its details from the products collection, followed by $unwind to flatten the joined data. Finally, the $project stage formats the output to include the product ID, order count, product name, brand name, the first product image, and the first selling price from the product’s variation data. This provides a concise summary of the most popular products along with key details for display or analysis.



    const topSelling = await orderItemSchema.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$productId",
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { orderCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          productId: "$_id",
          orderCount: 1,
          productName: "$productDetails.productName",
          productImage: {
            $arrayElemAt: ["$productDetails.productImages", 0],
          },
          sellingPrice: {
            $arrayElemAt: ["$productDetails.variation.sellingPrice", 0],
          },
          _id: 0,
        },
      },
    ]);

    return res.status(statusCode.OK).json({
      success: true,
      timeRange,
      topSellingProducts: topSelling,
    });
  } catch (error) {
    // console.error("Top Selling Product Error:", error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};