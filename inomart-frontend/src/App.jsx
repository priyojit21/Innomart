import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Registration from "./pages/User/Registration";
import Verify from "./pages/User/Verify";
import { Login } from "./pages/User/Login.jsx";
import Home from "./pages/User/Home.jsx";
import CustomerProtectedRoute from "./components/protectedRoutes/CustomerProtectedRoute.jsx";
import AddProduct from "./pages/Business/AddProduct.jsx";
import PaymentSuccess from "./pages/Payment/PaymentSuccess.jsx";
import Landing from "./pages/Landing.jsx";
import ForgetPassword from "./pages/User/ForgetPassword.jsx";
import OtpVerify from "./pages/User/OtpVerify.jsx";
import ResetPassword from "./pages/User/ResetPassword.jsx";
import { BusinessInformation } from "./pages/Business/BusinessInformation.jsx";
import StoreSetup from "./pages/Business/StoreSetup.jsx";
import StoreSetupPage2 from "./pages/Business/StoreSetupPage2.jsx";
import Agreement from "./pages/User/Agreement.jsx";
import AddCoupon from "./pages/Business/AddCoupon.jsx";
import Payment from "./pages/Business/Payment.jsx";
import Offer from "./pages/Business/Offer.jsx";
import UserAddress from "./pages/User/UserAddress.jsx";
import Address from "./pages/User/Address.jsx";
import CustomerSingleProductPage from "./pages/User/SingleProductPage.jsx";
import EditAddress from "./pages/User/EditAddress.jsx";
import OrderManagement from "./pages/Business/OrderManagement.jsx";
import UserProfile from "./pages/User/Profile.jsx";
import GetAllOrder from "./pages/User/getOrder.jsx";
import GetAllProduct from "./pages/Business/GetAllProduct.jsx";
import SingleProductPage from "./pages/Business/SingleProductPage.jsx";
import CustomerDashboard from "./pages/User/Dashboard.jsx";
import Wishlist from "./pages/User/Wishlist.jsx";
import Error from "./pages/Error.jsx";
import SellerHome from "./pages/Business/SellerHome.jsx";
import EditCoupon from "./pages/Business/EditCoupon.jsx";
import EditUserDetails from "./pages/User/EditUserDetails.jsx";
import ReviewManagement from "./pages/Business/ReviewManagement.jsx";
import EditProduct from "./pages/Business/editProduct.jsx";
import BusinessProtectedRoute from "./components/protectedRoutes/BusinessProtectedRoute.jsx";
import Sellerprofile from "./pages/Business/Sellerprofile.jsx";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/:role" element={<Registration />} />
          <Route path="/verify/:token" element={<Verify />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/otpVerify" element={<OtpVerify />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="*" element={<Error />} />
          <Route path="profile/edit/:id" element={<EditUserDetails />} />
          {/* customer routes */}
          <Route path="/address/add" element={<CustomerProtectedRoute><UserAddress /></CustomerProtectedRoute>} />
          <Route path="/address/edit/:id" element={<CustomerProtectedRoute><EditAddress /></CustomerProtectedRoute>} />
          <Route path="/address" element={<CustomerProtectedRoute><Address /></CustomerProtectedRoute>} />
          <Route path="/paymentSuccess" element={<CustomerProtectedRoute><PaymentSuccess /></CustomerProtectedRoute>} />
          <Route
            path="/userHome"
            element={
              <CustomerProtectedRoute>
                <Home />
              </CustomerProtectedRoute>
            }
          />
          <Route path="/profile" element={<CustomerProtectedRoute><UserProfile /></CustomerProtectedRoute>} />


          <Route
            path="/orders/customer"
            element={
              <CustomerProtectedRoute>
                <GetAllOrder />
              </CustomerProtectedRoute>
            }
          />

          <Route path="product/customer" element={<CustomerProtectedRoute><CustomerDashboard /></CustomerProtectedRoute>} />
          <Route
            path="product/customer/get/:id"
            element={<CustomerProtectedRoute><CustomerSingleProductPage /></CustomerProtectedRoute>}
          />
          <Route path="/wishlist" element={<CustomerProtectedRoute><Wishlist /></CustomerProtectedRoute>}></Route>
          {/* seller Routes
          business details setup */}
          <Route path="/businessInfo" element={<BusinessProtectedRoute allowedStep={1}><BusinessInformation /></BusinessProtectedRoute>} />
          <Route path="/paymentDetails" element={<BusinessProtectedRoute allowedStep={2}><Payment /></BusinessProtectedRoute>} />
          <Route path="/storeSetUp" element={<BusinessProtectedRoute allowedStep={3}><StoreSetup /></BusinessProtectedRoute>} />
          <Route path="/storeSetUp2" element={<BusinessProtectedRoute allowedStep={4}><StoreSetupPage2 /></BusinessProtectedRoute>} />
          <Route path="/agreement" element={<BusinessProtectedRoute allowedStep={5}><Agreement /></BusinessProtectedRoute>} />
          {/* sellerPages */}
          <Route path="/sellerHome" element={<BusinessProtectedRoute allowedStep={6}><SellerHome /></BusinessProtectedRoute>} />
          <Route path="product/seller" element={<BusinessProtectedRoute allowedStep={6}><GetAllProduct /></BusinessProtectedRoute>} />
          <Route
            path="product/seller/singleProduct/:id"
            element={<BusinessProtectedRoute allowedStep={6}><SingleProductPage /></BusinessProtectedRoute>}
          />
          <Route path="/product/seller/addProduct" element={<BusinessProtectedRoute allowedStep={6}><AddProduct /></BusinessProtectedRoute>} />
          <Route path="/product/seller/editProduct/:productId" element={<BusinessProtectedRoute allowedStep={6}><EditProduct /></BusinessProtectedRoute>} />
          <Route path="/offers" element={<BusinessProtectedRoute allowedStep={6}><Offer /></BusinessProtectedRoute>} />
          <Route
            path="/offers/addCoupon"
            element={
              <BusinessProtectedRoute allowedStep={6}><AddCoupon /></BusinessProtectedRoute>
            }
          />
          <Route path="/orders" element={<BusinessProtectedRoute allowedStep={6}><OrderManagement /></BusinessProtectedRoute>} />
          <Route path="/review" element={<ReviewManagement />} />
          <Route
            path="/offers/editCoupon/:couponId"
            element={<BusinessProtectedRoute allowedStep={6}><EditCoupon /></BusinessProtectedRoute>
            }
          />
          <Route path="/sellerProfile" element={<Sellerprofile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
