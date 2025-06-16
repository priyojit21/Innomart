import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getNotification } from "../controllers/notificationController/getAllNotification.js";


const notificationRoute = express.Router();

notificationRoute.get(
  "/getNotification",
  authMiddleware,
  getNotification
);

export default notificationRoute;