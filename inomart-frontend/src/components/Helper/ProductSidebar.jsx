import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import axiosInstance from "../../middleware/axiosInterceptor.js";
import StepsOrder from "./StepsOrder.jsx";
import toast, { Toaster } from "react-hot-toast";

const ProductSidebar = ({
  isOpen,
  onClose,
  myProduct,
  role,
  refreshOrders
}) => {
  if (!isOpen) return null;
  const [selectedStatus, setSelectedStatus] = useState(myProduct.status || "");
  const [statusOfStep, setStatus] = useState("finish");
  const [currentStep, setCurrentStep] = useState();
  const statusMap = {
    Pending: { step: 1, status: "finish" },
    Shipped: { step: 2, status: "finish" },
    "Out For Delivery": { step: 3, status: "finish" },
    Delivered: { step: 4, status: "finish" },
    "Cancel Initiated": { step: 5, status: "error" },
    Cancel: { step: 6, status: "error" },
    Refund: { step: 7, status: "error" },
  };

  const setStep = (statusStep) => {
    const currentStatus = statusStep || myProduct.status;

    if (statusMap[currentStatus]) {
      const { step, status } = statusMap[currentStatus];
      setCurrentStep(step);
      if (status) {
        setStatus(status);
      }
    }
  };

  useEffect(() => {
    if (isOpen && myProduct) {
      setSelectedStatus(myProduct.status);
      setStep(myProduct.status);
    }
  }, [isOpen, myProduct]);

  const handleChange = async (event) => {
    const newStatus = event.target.value;
    setSelectedStatus(event.target.value);
    setCurrentStep(event.target.selectedOptions[0].id);
    try {
      const res = await axiosInstance.post("/order/updateOrderStatus", {
        status: event.target.value,
        orderId: myProduct._id,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setSelectedStatus(newStatus);
        setStep(newStatus);
        refreshOrders();
      }
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-start z-50">
      <div
        className="bg-white w-full sm:w-96 xl:w-[700px] p-4 sm:p-6 max-h-screen overflow-y-auto transform transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          height: "100vh",
        }}
      >
        <button
          className="absolute top-4 right-4 text-xl bg-[#dfdede] text-gray-600 w-8 h-8 rounded-md"
          onClick={onClose}
        >
          <RxCross2 className="mx-auto" />
        </button>
        <h2 className="text-[16px] lg:text-[20px] font-medium text-[#0C0C0C] font-man mb-4">
          Order Details
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-start mt-4 lg:mt-[30px] xl:mt-[41px]">
          <div className="flex gap-3 xl:gap-6 mb-4">
            <img
              src={myProduct.productId?.productImages[0]}
              alt="productImage"
              className="rounded-lg w-20 h-20 sm:w-32 sm:h-32"
            />
            <div className="flex flex-col w-full gap-1 text-[#0C0C0C] font-semibold font-man xl:text-[18px]">
              <p className="text-sm sm:text-base xl:w-[290px]">
                {myProduct.productId?.productName}
              </p>
              <p className="text-[#707070] font-man font-medium text-xs sm:text-sm">
                Fashion
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 xl:gap-8 mb-4">
            <p className="text-[#707070] font-bold font-man xl:text-[18px]">
              Qty :{" "}
              <span className="text-[#0C0C0C]">{myProduct?.quantity}</span>
            </p>
            <p className="text-[#EC2F79] font-bold font-man xl:text-[18px]">
              <span>&#8377;</span> {myProduct?.price}
            </p>
          </div>
        </div>
        <hr className="mt-4 bg-[#E9E9E9] w-full" />

        <div className="mt-4 lg:mt-[30px] flex sm:flex-row gap-x-4 xl:gap-x-6 items-start justify-between">
          <div className="flex flex-col mb-4">
            <ul className="flex flex-col gap-2 text-[#707070] xl:text-[18px] xl:gap-[32px]">
              <li>Payment Method</li>
              <li>Status</li>
              {role === "Customer" ? "" : <li>Customer Name</li>}
              <li>Date</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2 text-[#707070] xl:text-[18px] xl:gap-[20px]">
            <p className="text-[#0C0C0C] font-man font-semibold xl:text-[18px]">
              Online Method
            </p>

            {role === "Customer" ? (
              <>
                <div className="flex flex-col">
                  <p className="font-semibold text-[#0C0C0C]">
                    {myProduct.status}
                  </p>
                </div>
                <ul className="flex flex-col gap-2 text-[#707070] xl:text-[18px] xl:gap-[32px]">
                  <li>
                    {new Date(myProduct.orderAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </li>
                </ul>
              </>
            ) : (
              <>
                <div className="flex flex-col w-full">
                  <select
                    required
                    className="mb-2 pt-2 pb-2 lg:pt-3 lg:pb-3 pl-3 pr-3 rounded-[10px] text-[14px] text-[#B0B3B6] font-medium border border-[#DDDDDD] sm:w-full lg:w-[250px] focus:outline-none focus:ring-2"
                    value={selectedStatus}
                    onChange={handleChange}
                  >
                    <option value="Pending" id="1" disabled="true">
                      Pending
                    </option>
                    <option value="Shipped" id="2">
                      Shipped
                    </option>
                    <option value="Out For Delivery" id="3">
                      Out For Delivery
                    </option>
                    <option value="Delivered" id="4">
                      Delivered
                    </option>
                    <option value="Cancel" id="5">
                      Cancel
                    </option>
                    <option value="Refund" id="6">
                      Refund
                    </option>
                  </select>
                </div>
                <ul className="flex flex-col gap-2 text-[#707070] xl:text-[18px] xl:gap-[32px]">
                  <li>{myProduct?.userId?.firstName}</li>
                  <li>
                    {new Date(myProduct.orderAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col lg:flex-row lg:justify-between bg-[#d9d8d8] px-4 py-4 rounded-lg">
          <StepsOrder
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            statusOfStep={statusOfStep}
          />
        </div>
        <div className="mt-4">
          <ul className="flex flex-col xl:mt-[34px] gap-4 text-[#707070] xl:text-[18px] font-man">
            <li>Payment</li>
            <div className="xl:mt-[29px] flex flex-row gap-x-14 lg:gap-[200px] xl:gap-[215px]">
              <div className="flex flex-col gap-2 xl:gap-8">
                <li>SubTotal</li>
                <li>Shipping fee</li>
                <li>Total</li>
              </div>
              <div className="flex flex-col gap-2 xl:gap-8">
                <li className="text-[#0C0C0C] font-man font-semibold">
                  <span>&#8377;</span>
                  {myProduct.price * myProduct.quantity}
                </li>
                <li className="text-[#0C0C0C] font-man font-semibold">
                  <span>&#8377;</span>30
                </li>
                <li className="text-[#0C0C0C] font-man font-semibold">
                  <span>&#8377;</span>
                  {myProduct.price * myProduct.quantity + 30}
                </li>
              </div>
            </div>
          </ul>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ProductSidebar;
