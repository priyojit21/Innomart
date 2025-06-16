import { Navigate } from "react-router-dom";

const BusinessProtectedRoute = ({ children, allowedStep }) => {
  const status = parseInt(localStorage.getItem("detailsStatus"));
  const role = localStorage.getItem("role");

  if (role !== "Seller") {
    return <Navigate to="/login" replace />;
  }

  // Rule 1: If status < 6 (still in onboarding steps 1-5)
  if (status < 6) {
    // Only allow access to current step (onboarding step must be strictly matched)
    if (status !== allowedStep) {
      switch (status) {
        case 1:
          return <Navigate to="/businessInfo" replace />;
        case 2:
          return <Navigate to="/paymentDetails" replace />;
        case 3:
          return <Navigate to="/storeSetUp" replace />;
        case 4:
          return <Navigate to="/storeSetUp2" replace />;
        case 5:
          return <Navigate to="/agreement" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
  }

  //  Rule 2: If status >= 6 (completed onboarding)
  if (status >= 6) {
    // User can only access pages with allowedStep 6 or higher
    if (allowedStep < 6) {
      return <Navigate to="/sellerHome" replace />;
    }
  }

  return children;
};

export default BusinessProtectedRoute;
