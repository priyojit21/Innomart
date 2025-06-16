import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../components/Seller/Sidebar";
import Navbar from "../../components/Seller/Navbar";
import ReviewCard from "../../components/Seller/ReviewCard";
import { Rate } from "antd";
import { Dropdown } from "antd";
import axiosInstance from "../../middleware/axiosInterceptor";

export default function ReviewManagement() {
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");
  const [reviews, setReviews] = useState([]);
  const [sellerReviews, setSellerReviews] = useState("");
  const [averageSellerRating, setAverageSellerRating] = useState("");
  const [reload, setReload] = useState("");

  const getAllReview = async () => {
    try {
      const res = await axiosInstance.get(
        "http://localhost:3000/product/allReview",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAverageSellerRating(res.data.averageSellerRating);
      setSellerReviews(res.data.totalSellerReviews);
      setReviews(res.data.productSummaries);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllReview();
  }, [dispatch, reload]);
  return (
    <>
      <div className="lg:flex items-start">
        <div className="flex-grow">
          <Sidebar />
        </div>
        <div className="lg:flex lg:flex-col lg:w-full">
          <Navbar pageName="Reviews" />
          <div className="h-[calc(100vh-100px)] bg-[#e3e0e0] p-[20px]  overflow-scroll gap-3 flex flex-col">
            <div className="flex flex-col md:gap-3">
              <h1 className="text-xl sm:text-2xl  font-man ">
                Seller Review
              </h1>
              {sellerReviews ? (
                <div className="flex flex-col md:flex-row gap-2 text-sm md:text-xl items-center">
                  <Rate
                    disabled
                    value={averageSellerRating}
                    allowHalf
                    className="text-2xl  md:text-3xl"
                  />
                  <div className="font-man">
                    <span>
                      Average Rating: {averageSellerRating} from {sellerReviews}{" "}
                      {sellerReviews === 1 ? "review" : "reviews"} across{" "}
                      {reviews.length}{" "}
                      {reviews.length === 1 ? "product" : "products"}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-center text-xl font-semibold">
                    No reviews to show{" "}
                  </p>
                </>
              )}
            </div>

            {sellerReviews > 0 && (
              <div className="w-full bg-white rounded-xl p-1 sm:p-4 shadow-md">
                <div className="relative flex flex-col gap-4 text-left">
                  {reviews.map((item, index) => (
                    <ReviewCard
                      key={index}
                      productId={item.productId}
                      productName={item.productName}
                      averageRating={item.averageRating}
                      totalReviews={item.totalReviews}
                      topReviews={item.topReviews}
                      ratingsCount={item.ratingsCount}
                      reload={reload}
                      setReload={setReload}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
