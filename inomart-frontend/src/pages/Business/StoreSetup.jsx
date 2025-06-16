import React, { useState } from "react";
import axiosInstance from "../../middleware/axiosInterceptor";
import Profile from "../../assets/profile.png";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ProgressBar from "../../components/ProgressBar";
import { useForm } from "react-hook-form";

const StoreSetup = () => {
  const [logo, setLogo] = useState(Profile);
  const accessToken = localStorage.getItem("accessToken");
  const businessId = localStorage.getItem("businessId");
  const [currentStep, setCurrentStep] = useState(3);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogoChange = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.type === "image/svg+xml") {
        toast.error("SVG files are not allowed!");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };

      const formData = new FormData();
      formData.append("uploadedFile", uploadedFile);

      try {
        const response = await axiosInstance.post(
          `http://localhost:3000/business/uploadLogo/${businessId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.success) {
          console.log("Logo uploaded successfully:", response.data.message);
        } else {
          console.error("Error uploading logo:", response.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data.message);
        console.error(
          "Error uploading logo:",
          error.response?.data.message || error.message
        );
      }

      reader.readAsDataURL(uploadedFile);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.put(
        "http://localhost:3000/business/editBusiness",
        { description: data.description },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Store Setup Added Successfully");
        localStorage.setItem("detailsStatus", 4);
        navigate("/storeSetUp2");
      }
    } catch (error) {
      console.log(error.response?.data.message);
    }
  };

  return (
    <div className=" lg:flex flex-col lg:flex-row w-full">
      <div className="lg:w-[28.336%]">
        <ProgressBar
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>
      <div className="w-full h-screen flex flex-col justify-center items-center bg-[#F7F7F7] px-4 ">
        <h1 className="font-man text-[24px] xs:text-[30px] font-semibold mb-[7px] mt-[57px]">
          Store Setup & Policies
        </h1>
        <p className="font-man text-center mb-[20px] text-[#5E5F63]">
          Join us today and start managing your business.
        </p>
        <form
          className="w-full max-w-[429px] mt-[57px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Logo Upload */}
          <label className="text-[#52575C] text-[16px] font-semibold mb-[8px] mt-[20px]">
            Store Logo
          </label>
          <div className="flex flex-col md:flex-row mb-[15px] text-center md:text-left items-center gap-4">
            <img
              src={logo}
              className="w-[120px] h-[120px] rounded-full border border-gray-300 object-cover mt-4"
              alt="Profile"
            />
            <div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoChange}
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer w-[96px] text-center p-2 rounded-[4px] border border-[#ADADAD] bg-gradient-to-b from-[#F6F6F6] to-[#DEDEDE]"
              >
                Choose File
              </label>
              <p className="mt-[12px]">Only .jpg and .png files will be allowed.</p>
            </div>
          </div>

          {/* Store Description */}
          <label
            className="text-[#52575C] text-[16px] font-semibold mb-[8px] mt-[20px]"
            htmlFor="description"
          >
            Store Description<span className="text-red-500">*</span>
          </label>
          <textarea
            rows="4"
            id="description"
            className={`w-full mt-[8px] pt-[18px] pb-[19px] pl-[25px] rounded-[10px] border ${errors.description ? "border-red-500" : "border-[#DDDDDD]"
              } resize-none focus:outline-none focus:ring-2 focus:ring-[#EC2F79]`}
            placeholder="Write store description"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 5,
                message: "Description must be at least 5 characters",
              },
            })}
          ></textarea>

          <p className="text-red-500 mt-2 text-sm h-[10px]">
            {errors?.description?.message}
          </p>


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
  );
};

export default StoreSetup;
