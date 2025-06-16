import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getChat } from "../controllers/chatController/getAllChats.js";

const chatRoute = express.Router();

chatRoute.get(
  "/getChat",
  authMiddleware,
  getChat
);

export default chatRoute;