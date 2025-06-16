import React, { useState } from "react";
import { Modal, Select } from "antd";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../middleware/axiosInterceptor";

export default function CancelModal({
  isModalOpen,
  setIsModalOpen,
  orderId,
  status,
  flag,
  setFlag, // from parent
}) {
  const [reason, setReason] = useState("Price of the product has now decreased");
  const [comment, setComment] = useState("");

  const accessToken = localStorage.getItem("accessToken");

  const handleOk = async () => {
    const cancellationData = {
      reason,
      orderItemId: orderId,
      comment,
    };

    try {
      const res = await axiosInstance.post(
        "http://localhost:3000/order/returnCancelOrder",
        cancellationData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        toast.success("Cancellation Request Initiated Successfully");
        setFlag(!flag); // Toggle flag to notify parent
      } else {
        toast.error("Failed to initiate cancellation.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    }

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleReasonChange = (value) => {
    setReason(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value.trim());
  };

  return (
    <>
      <Modal
        title="Cancel Order"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex flex-col">
          <label className="text-[#52575C] text-[16px] font-semibold font-man">
            Choose a reason for Cancellation <span className="text-red-500">*</span>
          </label>

          <Select
            showSearch
            placeholder="Select a reason"
            optionFilterProp="label"
            onChange={handleReasonChange}
            defaultValue={{
              value: "Price of the product has now decreased",
              label: "Price of the product has now decreased",
            }}
            options={[
              { value: "Price of the product has now decreased", label: "Price of the product has now decreased" },
              { value: "I want to change the delivery date", label: "I want to change the delivery date" },
              { value: "I want to change the size/color/type", label: "I want to change the size/color/type" },
              { value: "I want to change the delivery address", label: "I want to change the delivery address" },
              { value: "I'm worried about the ratings/reviews", label: "I'm worried about the ratings/reviews" },
              { value: "I want to change the contact details", label: "I want to change the contact details" },
              { value: "I was hoping for a shorter delivery time", label: "I was hoping for a shorter delivery time" },
              { value: "My reasons are not listed here", label: "My reasons are not listed here" },
            ]}
          />
        </div>
        <div>
          <label htmlFor="">Leave a comment: </label>
          <textarea
            className="w-full border-2 rounded-sm p-2"
            placeholder="Give Feedback"
            onChange={handleCommentChange}
          />
        </div>
      </Modal>
      <Toaster />
    </>
  );
}
