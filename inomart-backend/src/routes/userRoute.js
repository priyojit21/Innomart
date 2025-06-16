import express from "express";
import { registerUser } from "../controllers/userController/register.js";
import { validateData } from "../middlewares/validate.js";
import {
  resendEmail,
  signupUser,
  userNameChange,
} from "../validators/userValidation.js";
import { login } from "../controllers/userController/login.js";
import { signinUser } from "../validators/userValidation.js";
import { userAddressController } from "../controllers/userController/address.js";
import { userAddressValidation } from "../validators/userAddressValidationSchema.js";
import { logoutUser } from "../controllers/userController/logout.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { createBankDetails } from "../controllers/userController/bankDetails.js";
import { getBankDetails } from "../controllers/userController/bankDetails.js";
import { bankDetailsValidation } from "../validators/bankDetailsValidation.js";
import { attachFile } from "../controllers/userController/profilePicture.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { profileUpload } from "../middlewares/multer.js";
import { editUserAddress } from "../controllers/userController/editAddress.js";
import { userNameUpdate } from "../controllers/userController/userNameUpdate.js";
import { resendVerificationMail } from "../controllers/userController/resendVerificationMail.js";
import { forgetPassword } from "../controllers/userController/forgetPassword.js";
import { resetPassword } from "../controllers/userController/resetPassword.js";
import { userAccountDelete } from "../controllers/userController/accountDelete.js";
import { getUser } from "../controllers/userController/getUser.js";
import { regenerateAccessToken } from "../controllers/userController/regenerateAccessToken.js";
import { otpCheck } from "../controllers/userController/otpCheck.js";
import { accumulateData } from "../controllers/userController/accumulateData.js";
import {
  getAddress,
  getOneAddress,
} from "../controllers/userController/getAddress.js";
import { deleteUserAddress } from "../controllers/userController/deleteUserAddress.js";
import { popularProduct } from "../controllers/userController/popularProduct.js";
import { userAuthentication } from "../middlewares/userAuthentication.js";
import { makeDefaultAddress } from "../controllers/userController/makeDefaultAddress.js";

const userRoute = express.Router();

userRoute.post("/register", validateData(signupUser), registerUser);
userRoute.post("/verify", verifyToken);
userRoute.post(
  "/resend-mail",
  validateData(resendEmail),
  resendVerificationMail
);
userRoute.post("/login", validateData(signinUser), login);
userRoute.put(
  "/updateUserName",
  authMiddleware,
  validateData(userNameChange),
  userNameUpdate
);
userRoute.post(
  "/address",
  validateData(userAddressValidation),
  authMiddleware,
  userAddressController
);
userRoute.put(
  "/editUserAddress/:addressId",
  validateData(userAddressValidation),
  authMiddleware,
  editUserAddress
);
userRoute.delete("/logout", authMiddleware, logoutUser);
userRoute.post(
  "/createBankDetails/:businessId",
  validateData(bankDetailsValidation),
  authMiddleware,
  createBankDetails
);
userRoute.get("/getBankDetails", authMiddleware, getBankDetails);
userRoute.post(
  "/uploadProfilePic",
  authMiddleware,
  profileUpload.single("uploadedFile"),
  authMiddleware,
  attachFile
);
userRoute.delete("/accountDelete", authMiddleware, userAccountDelete);
userRoute.post("/forgetPassword", forgetPassword);
userRoute.post("/verifyOtp", otpCheck);
userRoute.post("/resetPassword", resetPassword);
userRoute.get("/getUser", authMiddleware, getUser);
userRoute.get("/regenerateAccessToken", regenerateAccessToken);
userRoute.get("/allData", authMiddleware, accumulateData);
userRoute.get("/getAddress", authMiddleware, getAddress);
userRoute.get("/getOneAddress/:id", authMiddleware, getOneAddress);
userRoute.delete("/deleteUserAddress/:id", authMiddleware, deleteUserAddress);
userRoute.get("/popularProduct", popularProduct);
userRoute.post(
  "/makeDefaultAddress",
  authMiddleware,
  userAuthentication,
  makeDefaultAddress
);
export default userRoute;
