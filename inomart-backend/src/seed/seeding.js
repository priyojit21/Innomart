import { databaseConnect } from "../config/dbConnection.js";
import Users from '../models/users/userSchema.js';
import UsersAddress from '../models/users/userAddressSchema.js';
import dummyUser from './User/dummyUser.js';
import dummyUserAddress from './User/dummyUserAddress.js';
import mongoose from 'mongoose';
import businessSchema from "../models/business/businessSchema.js";
import businessAddressSchema from "../models/business/businessAddressSchema.js";
import dummyBusiness from "./Business/dummyBusiness.js";
import dummyBusinessAddress from "./Business/dummyBusinessAddress.js";
import dummyBankDetails from "./User/dummyBankDetails.js";
import UsersBankDetails from '../models/users/userBankDetailsSchema.js';
import dummyProduct from "./Product/dummyProduct.js";
import Product from "../models/product/productSchema.js";
import dummyFeedback from "./Product/dummyFeedback.js";
import Feedback from "../models/product/feedbackSchema.js";
import Coupons from '../models/product/couponSchema.js';
import dummyCoupon from "./Product/dummyCoupon.js";


async function reset() {
    databaseConnect();
    await UsersAddress.deleteMany();
    await Users.deleteMany();
    await businessSchema.deleteMany();
    await UsersBankDetails.deleteMany();
    await businessAddressSchema.deleteMany();
    await Product.deleteMany();
    await Feedback.deleteMany();
    await Coupons.deleteMany();
}

async function createDummy() {
    await dummyUser(5);
    await dummyUserAddress(5);
    await dummyBankDetails(5);
    await dummyBusiness(5);
    await dummyBusinessAddress(5);
    await dummyProduct(5);
    await dummyFeedback(5);
    await dummyCoupon(5);
    mongoose.connection.close();
}

await reset();
createDummy();