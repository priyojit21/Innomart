import React from "react";
import { Modal } from "antd";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../middleware/axiosInterceptor";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showUser } from "../../features/productDetailSlice";
import { useEffect } from "react";
import { Flex, Rate } from "antd";
const desc = ["terrible", "bad", "normal", "good", "wonderful"];

export default function ReviewModal({
  isReviewModalOpen,
  setReviewModalOpen,
  productId,
}) {
  const accessToken = localStorage.getItem("accessToken");
  const [flag, setFlag] = useState(false);
  const [value, setValue] = useState(0);
  const [review, setReview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [ratingErrorMessage, setRatingError] = useState("");
  const feedbackData = {
    rating: value,
    review: review,
  };

  const handleOk = async () => {
    try {
      if (!feedbackData.review) {
        setErrorMessage("Review is needed");
        if (value === 0) {
          setRatingError("Rating is needed");
        } else {
          setRatingError("");
        }
        return;
      }
      if (value === 0) {
        setRatingError("Rating is needed");
        if (!feedbackData.review) {
          setErrorMessage("Review is needed");
        } else {
          setErrorMessage("");
        }
        return;
      }
      const res = await axiosInstance.post(
        `http://localhost:3000/product/feedback/${productId}`,
        feedbackData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setFlag(!flag);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred.");
    }
    setReviewModalOpen(false);
  };

  const handleCancel = () => {
    setReviewModalOpen(false);
  };

  const handleReview = (e) => {
    const value = e.target.value.trim("");
    setReview(value);
  };
  const handleSetRating = (e) => {
    setValue(e);
    if (value === 0) {
      setRatingError("Rating is needed");
    } else {
      setRatingError(null);
    }
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showUser());

  }, [flag, value]);

  return (
    <>
      <div>
        <Modal
          title="Give Feedback"
          open={isReviewModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="flex flex-col gap-5">
            <div>
              <Flex gap="middle" vertical>
                <Rate
                  tooltips={desc}
                  onChange={(e) => {
                    handleSetRating(e);
                  }}
                  value={value}
                />
              </Flex>
              {value > 0 ? (
                <></>
              ) : (
                <>
                  {" "}
                  <p className="text-xs text-red-600 font-semibold h-6">
                    {ratingErrorMessage}
                  </p>
                </>
              )}
            </div>
            <div>
              <label htmlFor="">Write a Review: </label>
              <textarea
                type=""
                className="w-full border-2 rounded-sm p-2"
                placeholder="How is the product? What do you like? What do you hate?"
                onChange={handleReview}
              />

              {!review ? (
                <>
                  <p className="text-xs text-red-600 font-semibold h-6">
                    {errorMessage}
                  </p>
                </>
              ) : (
                <></>
              )}
            </div>
          </div >
        </Modal >
      </div >
      <Toaster></Toaster>
    </>
  );
}
