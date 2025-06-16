import express from "express";
import { addProduct } from "../controllers/productController/addProduct.js";
import { validateData } from "../middlewares/validate.js";
import { productValidation } from "../validators/productValidation.js";
import { deleteAllProduct } from "../controllers/productController/deleteAllProduct.js";
import { deleteProduct } from "../controllers/productController/deleteProduct.js";
import { getAllProducts } from "../controllers/productController/fetchAllProduct.js";
import { productFeedback } from "../controllers/productController/feedbackProduct.js";
import { feedbackValidation } from "../validators/feedbackValidation.js";
import { couponValidation } from "../validators/couponValidation.js";
import { createCoupon } from "../controllers/productController/addProductCoupon.js";
import { getCoupon } from "../controllers/productController/getProductCoupon.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { sellerAuthentication } from "../middlewares/sellerAuthentication.js";
import { userAuthentication } from "../middlewares/userAuthentication.js";
import { addProductToWishlist } from "../controllers/wishlistController/addProduct.js";
import { removeProductFromWishlist } from "../controllers/wishlistController/removeProduct.js";
import { productsFromWishlist } from "../controllers/wishlistController/getProduct.js";
import { editProduct } from "../controllers/productController/editProduct.js";
import {
  multerErrorHandler,
  productImageUpload,
} from "../middlewares/multer.js";
import { productVideo } from "../controllers/productController/productVideo.js";
import { uploadProductVideo } from "../middlewares/multer.js";
import { getSingleProduct } from "../controllers/productController/getSingleProduct.js";
import { uploadProductImages } from "../controllers/productController/editProductImage.js";
import { deleteProductImage } from "../controllers/productController/deleteProductImage.js";
import { getSubCategory } from "../controllers/productController/getSubCategory.js";
import { getFeedback } from "../controllers/productController/getFeedback.js";
import { editCoupon } from "../controllers/productController/editCoupon.js";
import { deleteCoupon } from "../controllers/productController/deleteProductCoupon.js";
import { getAllWishlistProduct } from "../controllers/wishlistController/getAllProduct.js";
import { singleCoupon } from "../controllers/productController/getSingleCoupon.js";
import { updateProductStatus } from "../controllers/productController/updateProductStatus.js";
import {
  OverallTopSellingProduct,
  topSellingProduct,
} from "../controllers/productController/topSellingProduct.js";
import { lowStockProduct } from "../controllers/productController/lowStockProduct.js";
import { getAllReview } from "../controllers/productController/getAllReview.js";
import { getLatestReview } from "../controllers/productController/getLatestReviews.js";
import { addDraft } from "../controllers/productController/addDraft.js";
import { draftValidation } from "../validators/draftValidation.js";
import { fetchAllDrafts } from "../controllers/productController/fetchAllDrafts.js";
import { deleteProductVideo } from "../controllers/productController/deleteProductVideo.js";
import { getOrderCoupon } from "../controllers/productController/getOrderCoupon.js";
import { applyCoupon } from "../controllers/productController/applyCoupon.js";
import { respondToReview } from "../controllers/productController/respondToReview.js";
import { getInnomartCoupons } from "../controllers/productController/getInnomartCoupons.js";

const productRoute = express.Router();

productRoute.post(
  "/addProduct",
  authMiddleware,
  productImageUpload.array("uploadedFile"),
  multerErrorHandler,
  validateData(productValidation),
  authMiddleware,
  sellerAuthentication,
  addProduct
);
productRoute.post(
  "/draftProduct",
  authMiddleware,
  productImageUpload.array("uploadedFile"),
  multerErrorHandler,
  validateData(draftValidation),
  authMiddleware,
  sellerAuthentication,
  addDraft
);
productRoute.post("/getAll", authMiddleware, getAllProducts);
productRoute.post("/getDrafts", authMiddleware, fetchAllDrafts);
productRoute.delete(
  "/deleteAllProduct",
  authMiddleware,
  sellerAuthentication,
  deleteAllProduct
);
productRoute.put(
  "/updateStatus",
  authMiddleware,
  sellerAuthentication,
  updateProductStatus
);
productRoute.post(
  "/deleteProduct",
  authMiddleware,
  sellerAuthentication,
  deleteProduct
);
productRoute.post(
  "/feedback/:productId",
  validateData(feedbackValidation),
  authMiddleware,
  userAuthentication,
  productFeedback
);
productRoute.post(
  "/generateCoupon",
  validateData(couponValidation),
  authMiddleware,
  sellerAuthentication,
  createCoupon
);
productRoute.put(
  "/updateCoupon/:couponId",
  validateData(couponValidation),
  authMiddleware,
  sellerAuthentication,
  editCoupon
);
productRoute.put(
  "/editProduct/:productId",
  validateData(productValidation),
  authMiddleware,
  sellerAuthentication,
  editProduct
);
productRoute.get("/getAllCoupon", authMiddleware, getCoupon);
productRoute.post(
  "/addWishlist",
  authMiddleware,
  userAuthentication,
  addProductToWishlist
);
productRoute.delete(
  "/removeWishlist/:productId/:variationId",
  authMiddleware,
  userAuthentication,
  removeProductFromWishlist
);
productRoute.get(
  "/wishlist",
  authMiddleware,
  userAuthentication,
  productsFromWishlist
);

productRoute.post(
  "/getAllWishlist",
  authMiddleware,
  userAuthentication,
  getAllWishlistProduct
);

productRoute.post(
  "/videoProduct/:productId",
  authMiddleware,
  uploadProductVideo,
  authMiddleware,
  productVideo
);
productRoute.get(
  "/getSingleProduct/:productId",
  authMiddleware,
  getSingleProduct
);

productRoute.get("/getSingleCoupon/:couponId", authMiddleware, singleCoupon);

productRoute.post("/getSubCategory", authMiddleware, getSubCategory);

productRoute.post(
  "/uploadProductImages/:id",
  authMiddleware,
  productImageUpload.array("uploadedFile"),
  uploadProductImages
);

productRoute.delete(
  "/deleteProductImage/:id",
  authMiddleware,
  deleteProductImage
);
productRoute.delete(
  "/deleteProductVideo/:id",
  authMiddleware,
  deleteProductVideo
);

productRoute.post("/getFeedback", authMiddleware, getFeedback);

productRoute.delete(
  "/deleteCoupon/:couponId",
  authMiddleware,
  sellerAuthentication,
  deleteCoupon
);
productRoute.post(
  "/topSelling",
  authMiddleware,
  sellerAuthentication,
  topSellingProduct
);

productRoute.get("/overAllTopSelling", OverallTopSellingProduct);

productRoute.get(
  "/lowStock",
  authMiddleware,
  sellerAuthentication,
  lowStockProduct
);
productRoute.get(
  "/allReview",
  authMiddleware,
  sellerAuthentication,
  getAllReview
);
productRoute.post(
  "/getOrderCoupon",
  authMiddleware,
  userAuthentication,
  getOrderCoupon
);
productRoute.post(
  "/applyCoupon",
  authMiddleware,
  userAuthentication,
  applyCoupon
);
productRoute.get(
  "/getLatestReview",
  authMiddleware,
  sellerAuthentication,
  getLatestReview
);
productRoute.post(
  "/respondToReview",
  authMiddleware,
  sellerAuthentication,
  respondToReview
);
productRoute.get(
  "/getInnomartCoupons",
  getInnomartCoupons
);
export default productRoute;
