import express from "express";

import { businessValidation } from "../validators/businessValidation.js";
import { validateData } from "../middlewares/validate.js";
import { sellerBusiness } from "../controllers/businessController/sellerRegister.js";
import { businessAddressController } from "../controllers/businessController/businessAddress.js";
import { businessAddressValidation } from "../validators/businessAddressValidation.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { sellerAuthentication } from "../middlewares/sellerAuthentication.js";
import { editBusinessAddressController } from "../controllers/businessController/businessEditAddress.js";
import { checkSellerHasBusiness } from "../controllers/businessController/checkSellerHasBusiness.js";
import { editBusinessSchema } from "../controllers/businessController/editBusinessSchema.js";
import { idUpload, licenseUpload, logoUpload } from "../middlewares/multer.js";
import { businesslogoUpload } from "../controllers/businessController/logoUpload.js";
import { governmentIdUpload } from "../controllers/businessController/governmentIdUpload.js";
import { businesslicenseUpload } from "../controllers/businessController/licenseUpload.js";
import { inventoryManagement } from "../controllers/businessController/inventoryManagement.js";

const businessRoute = express.Router();

businessRoute.post(
  "/registerBusiness",
  validateData(businessValidation),
  authMiddleware,
  sellerAuthentication,
  sellerBusiness
);

businessRoute.post(
  "/address/:businessId",
  validateData(businessAddressValidation),
  authMiddleware,
  sellerAuthentication,
  businessAddressController
);

// businessRoute.post(
//   "/address",
//   validateData(businessAddressValidation),
//   authMiddleware,
//   sellerAuthentication,
//   businessAddressController
// );

businessRoute.put(
  "/editAddress/:businessId",
  validateData(businessAddressValidation),
  authMiddleware,
  sellerAuthentication,
  editBusinessAddressController
);

businessRoute.get(
  "/checkBusiness",
  authMiddleware,
  sellerAuthentication,
  checkSellerHasBusiness
);

businessRoute.post(
  "/uploadLogo/:id",
  authMiddleware,
  logoUpload.single("uploadedFile"),
  authMiddleware,
  businesslogoUpload
);

businessRoute.post(
  "/uploadGovId/:id",
  authMiddleware,
  idUpload.single("uploadedFile"),
  authMiddleware,
  governmentIdUpload
);

businessRoute.post(
  "/uploadLicense/:id",
  authMiddleware,
  licenseUpload.single("uploadedFile"),
  authMiddleware,
  businesslicenseUpload
);

businessRoute.put("/editBusiness", authMiddleware, editBusinessSchema);
businessRoute.get(
  "/inventoryManagement",
  authMiddleware,
  sellerAuthentication,
  inventoryManagement
);
export default businessRoute;
