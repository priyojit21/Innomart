import express from "express";
import { validateData } from "../middlewares/validate.js";
import { businessValidation } from "../validators/businessValidation.js";


const testRoute = express.Router();

testRoute.get("/validation", validateData(businessValidation));

export default testRoute;