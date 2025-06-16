import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { userAuthentication } from "../middlewares/userAuthentication.js";
import { createOrderItems } from "../controllers/orderController/createOrderItems.js";
import { sellerAuthentication } from "../middlewares/sellerAuthentication.js";
import { getOrderItems } from "../controllers/orderController/getAllOrder.js";
import { updateOrderStatus } from "../controllers/orderController/updateOrderStatus.js";
import { returnAndCancelItems } from "../controllers/orderController/returnAndCancelItems.js";
import { generateInvoice } from "../invoice/invoiceGenerator.js";
import { generateRevenue } from "../controllers/orderController/generateRevenue.js";
import { salesBreakDown } from "../controllers/orderController/salesBreakDown.js";

const orderRoute = express.Router();

orderRoute.post(
  "/addOrderItems",
  authMiddleware,
  userAuthentication,
  createOrderItems
);
orderRoute.get(
  "/getAllOrder",
  authMiddleware,
  getOrderItems
);
orderRoute.post(
  "/updateOrderStatus",
  authMiddleware,
  sellerAuthentication,
  updateOrderStatus
);
orderRoute.post("/getSalesBreakDown",authMiddleware,salesBreakDown);
orderRoute.post("/returnCancelOrder",authMiddleware,userAuthentication,returnAndCancelItems);
orderRoute.post("/generateInvoice/:orderId",authMiddleware,generateInvoice);
orderRoute.post("/revenue",authMiddleware,sellerAuthentication,generateRevenue);
export default orderRoute;
