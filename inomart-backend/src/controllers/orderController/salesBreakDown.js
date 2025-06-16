// import { statusCode } from "../../config/constant.js";
// import orderItemSchema from "../../models/order/orderItemSchema.js";
// import productSchema from "../../models/product/productSchema.js";

// export const salesBreakDown = async (req, res) => {
//   try {
//     const { sellerId, timeRange } = req.body;

//     if (!["daily", "monthly"].includes(timeRange)) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         message: "Invalid timeRange. Use 'daily' or 'monthly'.",
//       });
//     }

//     const products = await productSchema.find({ sellerId });
//     const productIds = products.map((product) => product._id);

//     const matchStage = {
//       productId: { $in: productIds },
//       status: "Delivered",
//     };

//     let groupStage;
//     let sortStage;

//     // For Monthly Breakdown
//     if (timeRange === "monthly") {
//       groupStage = {
//         $group: {
//           _id: {
//             year: { $year: "$orderAt" },
//             month: { $month: "$orderAt" },
//           },
//           totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
//           totalOrders: { $sum: 1 },
//         },
//       };
//       sortStage = { $sort: { "_id.year": 1, "_id.month": 1 } };
//     }
//     // For Daily Breakdown (Group by day of the week)
//     else if (timeRange === "daily") {
//       groupStage = {
//         $group: {
//           _id: {
//             year: { $year: "$orderAt" },
//             month: { $month: "$orderAt" },
//             dayOfWeek: { $dayOfWeek: "$orderAt" }, // This gives the day of the week (1=Sunday, 7=Saturday)
//           },
//           totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
//           totalOrders: { $sum: 1 },
//         },
//       };
//       sortStage = {
//         $sort: { "_id.year": 1, "_id.month": 1, "_id.dayOfWeek": 1 },
//       };
//     }

//     const salesData = await orderItemSchema.aggregate([
//       { $match: matchStage },
//       groupStage,
//       sortStage,
//     ]);

//     // Helper function to generate the daily breakdown
//     const generateDailyData = (salesData, currentYear, currentMonth) => {
//       const daysOfWeek = [
//         "Sunday",
//         "Monday",
//         "Tuesday",
//         "Wednesday",
//         "Thursday",
//         "Friday",
//         "Saturday",
//       ];

//       let completeData = [];
//       for (let i = 1; i <= 7; i++) {
//         const dayData = salesData.find(
//           (item) =>
//             item._id.year === currentYear &&
//             item._id.month === currentMonth &&
//             item._id.dayOfWeek === i
//         );

//         completeData.push({
//           day: daysOfWeek[i - 1], // Map the day number to the day name
//           totalRevenue: dayData ? dayData.totalRevenue : 0,
//           totalOrders: dayData ? dayData.totalOrders : 0,
//         });
//       }

//       return completeData;
//     };

//     // Helper function to generate the monthly breakdown
//     const generateMonthlyData = (salesData, currentYear) => {
//       let completeData = [];
//       for (let m = 1; m <= 12; m++) {
//         const monthData = salesData.find(
//           (item) => item._id.year === currentYear && item._id.month === m
//         );

//         completeData.push({
//           month: new Date(currentYear, m - 1).toLocaleString("default", {
//             month: "short",
//           }),
//           totalRevenue: monthData ? monthData.totalRevenue : 0,
//           totalOrders: monthData ? monthData.totalOrders : 0,
//         });
//       }
//       return completeData;
//     };

//     const now = new Date();
//     const currentYear = now.getFullYear();
//     const currentMonth = now.getMonth() + 1; // Months are 0-indexed in JavaScript

//     let responseData = {};

//     // Generate data based on timeRange
//     if (timeRange === "daily") {
//       responseData = generateDailyData(salesData, currentYear, currentMonth);
//     } else if (timeRange === "monthly") {
//       responseData = generateMonthlyData(salesData, currentYear);
//     }

//     return res.status(statusCode.OK).json({
//       success: true,
//       timeRange,
//       year: currentYear,
//       data: responseData,
//     });
//   } catch (error) {
//     res.status(statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

import { statusCode } from "../../config/constant.js";
import orderItemSchema from "../../models/order/orderItemSchema.js";
import productSchema from "../../models/product/productSchema.js";

export const salesBreakDown = async (req, res) => {
  try {
    const { sellerId, timeRange } = req.body;

    if (!["daily", "monthly"].includes(timeRange)) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Invalid timeRange. Use 'daily' or 'monthly'.",
      });
    }

    const products = await productSchema.find({ sellerId });
    const productIds = products.map((product) => product._id);

    const matchStage = {
      productId: { $in: productIds },
      status: "Delivered",
    };

    let groupStage;
    let sortStage;

    // For Monthly Breakdown
    if (timeRange === "monthly") {
      groupStage = {
        $group: {
          _id: {
            year: { $year: "$orderAt" },
            month: { $month: "$orderAt" },
          },
          totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
          totalOrders: { $sum: 1 },
        },
      };
      sortStage = { $sort: { "_id.year": 1, "_id.month": 1 } };
    }
    // For Daily Breakdown (Group by day of the week)
    else if (timeRange === "daily") {
      groupStage = {
        $group: {
          _id: {
            year: { $year: "$orderAt" },
            month: { $month: "$orderAt" },
            dayOfWeek: { $dayOfWeek: "$orderAt" }, // This gives the day of the week (1=Sunday, 7=Saturday)
          },
          totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
          totalOrders: { $sum: 1 },
        },
      };
      sortStage = {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.dayOfWeek": 1 },
      };
    }

    const salesData = await orderItemSchema.aggregate([
      { $match: matchStage },
      groupStage,
      sortStage,
    ]);

    // Helper function to generate the daily breakdown
    const generateDailyData = (salesData, currentYear, currentMonth) => {
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      let completeData = [];
      for (let i = 1; i <= 7; i++) {
        const dayData = salesData.find(
          (item) =>
            item._id.year === currentYear &&
            item._id.month === currentMonth &&
            item._id.dayOfWeek === i
        );

        completeData.push({
          day: daysOfWeek[i - 1], // Map the day number to the day name
          totalRevenue: dayData ? dayData.totalRevenue : 0,
          totalOrders: dayData ? dayData.totalOrders : 0,
        });
      }

      return completeData;
    };

    // Helper function to generate the monthly breakdown
    const generateMonthlyData = (salesData, currentYear) => {
      let completeData = [];
      for (let m = 1; m <= 12; m++) {
        const monthData = salesData.find(
          (item) => item._id.year === currentYear && item._id.month === m
        );

        completeData.push({
          month: new Date(currentYear, m - 1).toLocaleString("default", {
            month: "short",
          }),
          totalRevenue: monthData ? monthData.totalRevenue : 0,
          totalOrders: monthData ? monthData.totalOrders : 0,
        });
      }
      return completeData;
    };

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // Months are 0-indexed in JavaScript

    let responseData = {};
    let highestEarning = { month: "", earning: 0 };
    let highestOrder = { month: "", orders: 0 };

    // Generate data based on timeRange
    if (timeRange === "daily") {
      responseData = generateDailyData(salesData, currentYear, currentMonth);
      // Find the highest earning and highest order in daily data
      responseData.forEach((day) => {
        if (day.totalRevenue > highestEarning.earning) {
          highestEarning = { day: day.day, earning: day.totalRevenue };
        }
        if (day.totalOrders > highestOrder.orders) {
          highestOrder = { day: day.day, orders: day.totalOrders };
        }
      });
    } else if (timeRange === "monthly") {
      responseData = generateMonthlyData(salesData, currentYear);
      // Find the highest earning and highest order in monthly data
      responseData.forEach((month) => {
        if (month.totalRevenue > highestEarning.earning) {
          highestEarning = { month: month.month, earning: month.totalRevenue };
        }
        if (month.totalOrders > highestOrder.orders) {
          highestOrder = { month: month.month, orders: month.totalOrders };
        }
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      timeRange,
      year: currentYear,
      data: responseData,
      highestEarning, // Include the highest earning data
      highestOrder, // Include the highest order data
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
