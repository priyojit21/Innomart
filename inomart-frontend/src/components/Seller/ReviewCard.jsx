import { Progress, Rate } from "antd";
import { useState, useRef } from "react";
import axiosInstance from "../../middleware/axiosInterceptor";
import star from "../../assets/user/star.svg";
import TopReviews from "./TopReviews";
import { Toaster } from "react-hot-toast";

const ReviewCard = ({
  productName,
  averageRating,
  totalReviews,
  topReviews,
  ratingsCount,
  productId,
  reload,
  setReload,
}) => {
  const [allReviews, setAllReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const reviewSectionRef = useRef(null);

  const data = { productId, timeRange: "overall" };

  const handleViewAllClick = () => {
    setShowAllReviews(true);
    setAllReviews(topReviews);
    setCurrentPage(1);
    fetchAllReviews(2);
  };

  const handleViewClick = () => {
    const nextPage = currentPage + 1;
    fetchAllReviews(nextPage);
  };

  const fetchAllReviews = async (page = 1) => {
    try {
      const response = await axiosInstance.post(
        `http://localhost:3000/product/getFeedback?page=${page}&limit=3`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        const newReviews = response.data.data.map((item) => ({
          review: item.review,
          user: item.userId.firstName,
          rating: item.rating,
          profilePic: item.userId.profilePic || "",
          dateTime: item.dateTime,
          comment: item.comment || "",
          feedbackId: item.feedbackId,
        }));
        setAllReviews((prev) => [...prev, ...newReviews]);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch all reviews", error);
    }
  };

  const reviewsToShow = showAllReviews ? allReviews : topReviews;

  return (
    <>
      <div className="bg-white   p-6 w-full max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">{productName}</h2>
        </div>

        {/* Ratings Summary */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center">
            <p className="text-5xl font-semibold text-pink-600">{averageRating}</p>
            <Rate disabled allowHalf value={averageRating} className="text-2xl mt-2" />
            <p className="text-gray-600 mt-2 text-sm">
              ({totalReviews} {totalReviews === 1 ? "Review" : "Reviews"})
            </p>
          </div>

          {/* Distribution */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingsCount[rating] || 0;
              const percentage = totalReviews ? (count / totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center mb-2">
                  <span className="w-6 text-sm">{rating}</span>
                  <img src={star} alt="star" className="w-4 mx-1" />
                  <Progress
                    percent={percentage}
                    showInfo={false}
                    strokeColor="#EC2F79"
                    className="flex-1"
                  />
                  <span className="w-8 text-right text-sm">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8" ref={reviewSectionRef}>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Customer Reviews</h3>
          <div className="space-y-4">
            {reviewsToShow.map((item, index) => (
              <TopReviews
                key={index}
                review={item.review}
                user={item.user}
                rating={item.rating}
                profilePic={item.profilePic}
                dateTime={item.dateTime}
                comment={item.comment}
                feedbackId={item.feedbackId}
                reload={reload}
                setReload={setReload}
              />
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-6">
          {!showAllReviews ? (
            <button
              onClick={handleViewAllClick}
              className="text-pink-600 font-medium hover:underline"
            >
              View all reviews for {productName}
            </button>
          ) : (
            currentPage < totalPages && (
              <button
                onClick={handleViewClick}
                className="bg-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-700 transition"
              >
                Load more reviews
              </button>
            )
          )}
        </div>

        <Toaster />
      </div>
    </>
  );
};

export default ReviewCard;
