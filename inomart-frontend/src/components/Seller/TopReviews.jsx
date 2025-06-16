import dummy from "../../assets/user/dummyUser.jpg";
import admin from "../../assets/seller/admin.svg";
import { Rate } from "antd";
import CommentOnReview from "./CommentOnReview";
import { useState } from "react";

const TopReviews = ({
  review,
  user,
  rating,
  dateTime,
  profilePic,
  comment,
  feedbackId,
  reload,
  setReload,
}) => {
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const options = { month: "long" };
    const month = date.toLocaleString("en-US", { ...options, timeZone: "UTC" });
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${month} ${day}, ${year} at ${hours}:${minutes}`;
  };

  const handleComment = () => {
    setCommentModalOpen(true);
  };

  return (
    <>
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-6 space-y-4">
        {/* Top Section: User + Rating */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <img
              src={profilePic || admin || dummy}
              alt="User"
              className="rounded-full w-[60px] h-[60px] object-cover border border-gray-300"
            />
            <div className="space-y-1">
              <Rate
                disabled
                value={rating}
                className="text-pink-500 text-base md:text-lg"
              />
              <p className="font-semibold text-gray-800 text-lg">{user}</p>
              <p className="text-gray-500 text-sm">{formatDateTime(dateTime)}</p>
            </div>
          </div>

          <div className="text-gray-700 text-base md:text-lg leading-relaxed flex-1 line-clamp-3 overflow-hidden break-words">
            {review}
          </div>
        </div>

        {/* Comment Section */}
        {comment && (
          <div className="bg-gray-50 border-t border-gray-200 pt-4 mt-2 px-2 rounded-md">
            <p className="font-semibold text-gray-800 mb-1">Your reply:</p>
            <p className="text-gray-700 text-base line-clamp-2 overflow-hidden break-words">{comment}</p>
          </div>
        )}

        {/* Reply Button */}
        <div className="flex justify-end">
          <button
            onClick={handleComment}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            {comment ? "Edit Reply" : "Reply"}
          </button>
        </div>
      </div>

      {/* Modal */}
      <CommentOnReview
        isCommentModalOpen={isCommentModalOpen}
        setCommentModalOpen={setCommentModalOpen}
        feedbackId={feedbackId}
        reload={reload}
        setReload={setReload}
      />
    </>
  );
};

export default TopReviews;
