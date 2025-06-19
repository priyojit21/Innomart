import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

import { statusCode } from "./src/config/constant.js";
import userRoute from "./src/routes/userRoute.js";
import businessRoute from "./src/routes/businessRoute.js";
import productRoute from "./src/routes/productRoute.js";
import { databaseConnect } from "./src/config/dbConnection.js";
import testRoute from "./src/routes/testRoute.js";
import cartRoute from "./src/routes/cartRoutes.js";
import paymentRoute from "./src/routes/paymentRoute.js";

import Razorpay from "razorpay";
import orderRoute from "./src/routes/orderRoute.js";
import jwt from "jsonwebtoken";
import notificationRoute from "./src/routes/notificationRoute.js";
import Notification from "./src/models/notification/notificationSchema.js";
import Chat from "./src/models/chat/chatSchema.js";
import chatRoute from "./src/routes/chatRoute.js";
import categoryRoute from "./src/routes/categoryRoute.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

app.use("/test", testRoute);
app.use("/user", userRoute);
app.use("/business", businessRoute);
app.use("/product", productRoute);
app.use("/payment", paymentRoute);
app.use("/uploads", express.static("uploads"));
app.use("/cart", cartRoute);
app.use("/order", orderRoute);
app.use("/notify", notificationRoute);
app.use("/chat", chatRoute);
app.use("/category", categoryRoute);

app.get("/",(req,res) => {
  res.send("App running");
});

app.use((req, res) => {
  res
    .status(statusCode.NOT_FOUND)
    .send("<h1>Page not found on the server</h1>");
});

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

server.listen(port, () => {
  console.log(`Inomart backend listening on port ${port}`);
});

databaseConnect();

io.use((socket, next) => {
  try {
    if (socket.senderId) next();
    const accessToken = socket.handshake.headers.authorization.replace(
      "Bearer ",
      ""
    );
    jwt.verify(accessToken, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.log(err);
        return next(new Error("Authentication error"));
      }
      socket.senderId = decoded.id;
      next();
    });
  } catch (error) {
    console.log(error.message);
  }
});

io.on("connection", (socket) => {
  const { senderId } = socket;
  console.log("User connected", senderId);
  socket.join(senderId);

  socket.on("send_notification", async ({ receiverId, message }) => {
    await Notification.create({ userId: receiverId, message });
    socket.to(receiverId.toString()).emit("receive_notification", message);
  });

  socket.on("send_chat", async ({ receiverId, message }) => {
    const newChat = { senderId, receiverId, message };
    await Chat.create({ ...newChat });
    socket.to(receiverId.toString()).emit("receive_chat", newChat);
  });
});

