import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import axiosInstance from "../../middleware/axiosInterceptor.js";
import toast, { Toaster } from "react-hot-toast";
import paymentDetailsSchema from "../../validators/paymentDetails.js";
import { yupResolver } from "@hookform/resolvers/yup";
import ProgressBar from "../../components/ProgressBar.jsx";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(paymentDetailsSchema),
  });

  const [currentStep, setCurrentStep] = useState(2);
  const accessToken = localStorage.getItem("accessToken");
  const businessId = localStorage.getItem("businessId");
  const navigate = useNavigate();


  async function onSubmit(data) {
    try {
      const response = await axiosInstance.post(
        `http://localhost:3000/user/createBankDetails/${businessId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Bank Details Added Successfully");
        reset();
        localStorage.setItem("detailsStatus", 3)
        navigate("/storeSetUp");
      }

    } catch (error) {
      console.log("Error occurred: ", error);
      toast.error(error.response.data.message || "Error Occurred");
    }
  }

  return (
    <>
      <div className="flex font-man ">
        <div className="w-[28.336%] h-screen hidden lg:block">
          <ProgressBar currentStep={currentStep} />
        </div>
        <div className="w-full lg:w-[71.664%] h-screen bg-[#F7F7F7] flex flex-col justify-center items-center px-3  overflow-y-scroll">
          <div className="font-man text-[24px] sm:text-[30px] font-semibold mb-[20px] xl:mb-[57px] flex flex-col justify-center items-center">
            <div>Payment & Financial</div>
            <div className="text-center text-[#5E5F63] text-[16px] font-medium min-[375px]:mt-[13px]">
              Join us today and start managing your business.
            </div>
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            <form
              className="w-[98%] sm:w-full max-w-[354px] "
              onSubmit={handleSubmit(onSubmit)}
            >

              <label className="text-[#52575C] text-[16px] font-semibold">
                Account Holder Name <span className="text-red-500 mt-1 me-auto">*</span>
              </label>
              <input
                name="accountHolderName"
                type="text"
                required
                className="w-full flex justify-center sm:w-full  pt-[10px] pb-[10px] pl-[25px] mt-[4px] sm:mt-[8px] font-medium rounded-[10px] text-[14px] border border-[#DDDDDD]  focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                placeholder="Enter account holder name"
                {...register("userName")}
              />
              <p className="text-xs text-red-600 font-semibold h-4">{formState.errors.userName?.message}</p>



              <label className="text-[#52575C] text-[16px] font-semibold ">
                Bank Name <span className="text-red-500 mt-1">*</span>
              </label>
              <select
                required
                className="w-full mb-[15px] mt-[4px] sm:mt-[8px] pt-[10px] pb-[10px] pl-[25px] pr-[25px] rounded-[10px] text-[14px] text-[#B0B3B6] font-medium border border-[#DDDDDD] sm:w-full focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                {...register("bankName")}
                defaultValue=""
              >
                <option value="" disabled>
                  Select bank
                </option>
                <option value="HDFC Bank Ltd.">HDFC Bank Ltd.</option>
                <option value="ICICI Bank Ltd.">ICICI Bank Ltd.</option>
                <option value="State Bank of India">State Bank of India</option>
                <option value="Kotak Mahindra Bank Ltd.">
                  Kotak Mahindra Bank Ltd.
                </option>
                <option value="Axis Bank Ltd.">Axis Bank Ltd.</option>
                <option value="IndusInd Bank Ltd.">IndusInd Bank Ltd.</option>
                <option value="Bank of Baroda">Bank of Baroda</option>
                <option value="Union Bank of India">Union Bank of India</option>
                <option value="Canara Bank">Canara Bank</option>
              </select>


              <label className="text-[#52575C] text-[16px] font-semibold ">
                Account Number <span className="text-red-500 mt-1">*</span>
              </label>
              <input
                name="bankName"
                type="Number"
                required
                className="w-full pt-[10px] pb-[10px] pl-[25px] mt-[4px] sm:mt-[8px] font-medium rounded-[10px] text-[14px] border border-[#DDDDDD] sm:w-full focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                placeholder="Enter account number"
                {...register("accountNumber", { valueAsNumber: true })}
              />
              <p className="text-xs text-red-600 font-semibold h-4">{formState.errors.accountNumber?.message}</p>

              <label className="text-[#52575C] text-[16px] font-semibold ">
                IFSC / Swift Code <span className="text-red-500 mt-1">*</span>
              </label>
              <input
                name="bankName"
                type="text"
                required
                className="w-full pt-[10px] pb-[10px] pl-[25px] mt-[4px] sm:mt-[8px] font-medium rounded-[10px] text-[14px] border border-[#DDDDDD] sm:w-full focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                placeholder="Enter IFSC / Swift Code"
                {...register("ifscCode")}
              />
              <p className="text-xs text-red-600 font-semibold h-4">{formState.errors.ifscCode?.message}</p>

              <label className="text-[#52575C] text-[16px] font-semibold ">
                Tax Identification Number (TIN/GST/VAT){" "}
                <span className="text-red-500 mt-1">*</span>
              </label>
              <input
                name="bankName"
                type="text"
                required
                className="w-full pt-[10px] pb-[10px] pl-[25px] mt-[4px] sm:mt-[8px] font-medium rounded-[10px] text-[14px] border border-[#DDDDDD] sm:w-full focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                placeholder="Enter TIN/GST/VAT"
                {...register("taxNumber")}
              />
              <p className="text-xs text-red-600 font-semibold h-4">{formState.errors.taxNumber?.message}</p>

              <label className="text-[#52575C] text-[16px] font-semibold ">
                Payout Method <span className="text-red-500 mt-1">*</span>
              </label>
              <select
                required
                className="w-full pt-[10px] pb-[10px] pl-[25px] mt-[4px] sm:mt-[8px] font-medium rounded-[10px] text-[14px] text-[#B0B3B6] border border-[#DDDDDD] sm:w-full focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                {...register("payoutMethod")}
                defaultValue=""
              >
                <option value="" disabled>
                  Select payout method
                </option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Debit/Credit Cards">Debit/Credit Cards</option>
              </select>


              <button
                type="submit"
                className="bg-[#EC2F79] text-white rounded-[10px] w-full mt-[21px] lg:mt-[41px] pt-[13px] pb-[17.5px] font-man text-[14px]"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
      <Toaster></Toaster>
    </>
  );
}
