import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../middleware/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ProgressBar from "../../components/ProgressBar";

const StoreSetupPage2 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [IdName, setIdName] = useState("");
  const [LicenseName, setLicenseName] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const businessId = localStorage.getItem("businessId");
  const [currentStep, setCurrentStep] = useState(4);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Update business ID type
      const response = await axiosInstance.put(
        "http://localhost:3000/business/editBusiness",
        {
          governmentIdType: data.selectedId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Store Setup Added Successfully");
        localStorage.setItem("detailsStatus", 5);
        navigate("/agreement");
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleIdChange = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === "image/svg+xml") {
      toast.error("SVG files are not allowed!");
      return;
    }
    if (uploadedFile && !["image/jpeg", "image/png", "image/jpg"].includes(uploadedFile.type)) {
      toast.error("Only .jpg and .png files are allowed!");
      return;
    }

    setIdName(uploadedFile.name);

    const formData = new FormData();
    formData.append("uploadedFile", uploadedFile);

    try {
      const response = await axiosInstance.post(
        `http://localhost:3000/business/uploadGovId/${businessId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleLicenseChange = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === "image/svg+xml") {
      toast.error("SVG files are not allowed!");
      return;
    }
    if (uploadedFile && !["image/jpeg", "image/png", "image/jpg"].includes(uploadedFile.type)) {
      toast.error("Only .jpg and .png files are allowed!");
      return;
    }

    setLicenseName(uploadedFile.name);

    const formData = new FormData();
    formData.append("uploadedFile", uploadedFile);

    try {
      const response = await axiosInstance.post(
        `http://localhost:3000/business/uploadLicense/${businessId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <div className="lg:flex flex-col lg:flex-row w-full">
        <div className="lg:w-[28.336%]">
          <ProgressBar currentStep={currentStep} setCurrentStep={setCurrentStep} />
        </div>
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#F7F7F7] px-4">
          <h1 className="font-man text-[24px] xs:text-[30px] font-semibold mb-[7px] mt-[57px]">
            Store Setup & Policies
          </h1>
          <p className="font-man text-center mb-[20px] text-[#5E5F63]">
            Join us today and start managing your business.
          </p>
          <form className="w-full max-w-[429px] mt-[57px]" onSubmit={handleSubmit(onSubmit)}>
            <label className="text-[#52575C] text-[16px] font-semibold mb-[8px] mt-[20px]">
              Government ID Proof <span className="text-red-500">*</span>
            </label>
            <select
              {...register("selectedId", { required: "Please select an ID Proof" })}
              className="w-full mt-[8px] mb-[6px] pt-[18px] pb-[19px] pl-[25px] rounded-[10px] border border-[#DDDDDD] text-[#B0B3B6] focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
            >
              <option value="">Select ID</option>
              <option value="Aadhaar Card">Aadhaar Card</option>
              <option value="Driver's License">Driver's License</option>
              <option value="PAN">PAN</option>
              <option value="Voter ID">Voter ID</option>
              <option value="Passport">Passport</option>
            </select>
            <p className="text-red-500 text-sm mb-2 h-[10px]">{errors?.selectedId?.message}</p>


            <div className="mb-[30px] mt-[20px]">
              <input
                type="file"
                className="hidden mt-[12px]"
                accept="image/*"
                id="file-input-1"
                onChange={handleIdChange}
              />

              <label
                htmlFor="file-input-1"
                className="cursor-pointer w-[96px] text-center p-2 rounded-[4px] border border-[#ADADAD] bg-gradient-to-b from-[#F6F6F6] to-[#DEDEDE]"
              >
                Choose File
              </label>
              <p className="mt-[12px] inline ml-2 w-[250px] overflow-hidden">
                {IdName || "Only .jpg and .png files will be allowed "}
              </p>
            </div>

            <label className="text-[#52575C] text-[16px] font-semibold mb-[8px] ">
              Business License/Certificate
            </label>
            <div className="mb-[30px] mt-[19px]">
              <input
                type="file"
                className="hidden mt-[12px]"
                accept="image/*"
                id="file-input-2"
                onChange={handleLicenseChange}
              />

              <label
                htmlFor="file-input-2"
                className="cursor-pointer w-[96px] text-center p-2 rounded-[4px] border border-[#ADADAD] bg-gradient-to-b from-[#F6F6F6] to-[#DEDEDE]"
              >
                Choose File
              </label>
              <p className="mt-[12px] inline ml-2">
                {LicenseName || "Only .jpg and .png files will be allowed"}
              </p>
            </div>

            <button
              type="submit"
              className="bg-[#EC2F79] text-white rounded-[10px] w-full mt-[21px] pt-[13px] pb-[17.5px] font-man text-[14px]"
            >
              Continue
            </button>
          </form>
          <Toaster />
        </div>
      </div>
    </>
  );
};

export default StoreSetupPage2;
