import React from "react";
import { Modal } from "antd";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../middleware/axiosInterceptor";
import { useState } from "react";

export default function CommentOnReview({
  isCommentModalOpen,
  setCommentModalOpen,
  feedbackId,
  reload,
  setReload,

}) {
  const accessToken = localStorage.getItem("accessToken");
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const feedbackData = {
    feedbackId: feedbackId,
    comment: comment,
  };

  const handleOk = async () => {
    try {
      if (!feedbackData.comment) {
        setErrorMessage("Comment is needed");
        return;
      }
      const res = await axiosInstance.post(
        `http://localhost:3000/product/respondToReview`,
        feedbackData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setCommentModalOpen(false);
        setReload(!reload);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred.");
    }
    setReload(!reload);
    setCommentModalOpen(false);
  };

  const handleCancel = () => {
    setCommentModalOpen(false);
  };

  const handleNewComment = (e) => {
    const value = e.target.value.trim("");
    setComment(value);
  };

  return (
    <>
      <div>
        <Modal
          title="Leave a comment :"
          open={isCommentModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="flex flex-col gap-5">
            <div>
              <textarea
                type=""
                className="w-full border-2 rounded-sm p-2"
                placeholder="your views on the feedback provided"
                onChange={handleNewComment}
              />

              {!comment ? (
                <>
                  <p className="text-xs text-red-600 font-semibold h-6">
                    {errorMessage}
                  </p>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </Modal>
      </div>
      <Toaster></Toaster>
    </>
  );
}
