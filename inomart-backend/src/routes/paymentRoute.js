import express from "express";
import {
  checkOut,
  getPaymentKey,
  paymentFailed,
  paymentVerification,
} from "../controllers/paymentController/paymentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const paymentRoute = express.Router();

paymentRoute.post("/checkout/:orderId", authMiddleware, checkOut);
paymentRoute.post("/paymentVerification/:id", paymentVerification);
paymentRoute.post("/paymentFailed", authMiddleware, paymentFailed);
paymentRoute.get("/getKey", getPaymentKey);

export default paymentRoute;
