import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { userAuthentication } from "../middlewares/userAuthentication.js";
import { addProductToCart } from "../controllers/cartController/addToCart.js";
import { removeFromCart } from "../controllers/cartController/removeFromCart.js";
import { getCartItems } from "../controllers/cartController/getCartitems.js";
import { deleteCartItem } from "../controllers/cartController/deleteCart.js";

const cartRoute = express.Router();

cartRoute.post(
  "/addItems",
  authMiddleware,
  userAuthentication,
  addProductToCart
);
cartRoute.get(
  "/getAllCartItems",
  authMiddleware,
  userAuthentication,
  getCartItems
);
cartRoute.delete(
  "/removeFromCart/:productId/:variationId",
  authMiddleware,
  userAuthentication,
  removeFromCart
);
cartRoute.delete(
  "/deleteFromCart/:productId/:variationId",
  authMiddleware,
  userAuthentication,
  deleteCartItem
);


export default cartRoute;
