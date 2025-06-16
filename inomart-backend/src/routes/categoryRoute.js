import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { sellerAuthentication } from "../middlewares/sellerAuthentication.js";
import { addCategory } from "../controllers/categoryController/addCategory.js";
import { getAllCategory } from "../controllers/categoryController/getAllCategory.js";

const categoryRoute = express.Router();


categoryRoute.post(
  "/add",
  authMiddleware,
  sellerAuthentication,
  addCategory
);

categoryRoute.get(
    "/get",
    authMiddleware,
    getAllCategory
  );

export default categoryRoute;
