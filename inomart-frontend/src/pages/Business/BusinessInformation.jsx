import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../middleware/axiosInterceptor";
import Select from "react-select";
import ReactFlagsSelect from "react-world-flags";
import ProgressBar from "../../components/ProgressBar";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import businessInformationValidationSchema from "../../validators/business/businessInformation";

export const BusinessInformation = () => {
  const { register, handleSubmit, formState, reset, setValue } = useForm(
    { resolver: yupResolver(businessInformationValidationSchema) }
  );
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const accessToken = localStorage.getItem("accessToken");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axiosInstance.get("https://restcountries.com/v3.1/all");
        const countryData = response.data.map((country) => ({
          code: country.cca2,
          value: country.name.common,
        }));
        setCountries(countryData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setValue("country", country?.code || "");
  };

  const submitBusinessInfo = async (data) => {
    const businessData = {
      storeName: data.storeName,
      type: data.type,
      registrationNumber: data.registrationNumber
    }
    const addressData = {
      address: data.address,
      zipCode: data.zipCode,
      country: data.country,
    }
    let businessId;

    try {
      const response = await axiosInstance.post(
        "http://localhost:3000/business/registerBusiness",
        businessData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
      );
      console.log("my resp ", response);

      if (response.data.success) {
        toast.success(response.data.message);
        reset();
      }
    } catch (error) {
      toast.error(error.response?.data.message || "Error Occurred");
    }

    try {
      const response = await axiosInstance.get("http://localhost:3000/business/checkBusiness", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (response.data.success) {
        businessId = response.data.data._id;
        localStorage.setItem("businessId", businessId);

      }
    } catch (error) {
      console.log(error.response.data.message);
    }

    try {
      const response = await axiosInstance.post(`http://localhost:3000/business/address/${businessId}`, addressData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data.success) {
        localStorage.setItem("detailsStatus", 2)
        navigate("/paymentDetails")
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <>
      <div className=" lg:flex flex-col lg:flex-row w-full">
        <div className="lg:w-[28.336%]">
          <ProgressBar currentStep={currentStep} />
        </div>
        <div className="w-full lg:w-[71.664%]  h-screen flex flex-col justify-center items-center bg-[#F7F7F7] px-4">
          <h1 className="font-man text-[24px] xs:text-[30px] font-semibold mb-[7px] mt-[57px]">
            Business Information
          </h1>
          <p className="font-man text-center mb-[20px] text-[#5E5F63]">
            Join us today and start managing your business.
          </p>
          <form
            className="w-full max-w-[429px]"
            onSubmit={handleSubmit(submitBusinessInfo)}
          >
            <label className="text-[#52575C] text-[16px] font-semibold mb-[8px] flex items-center gap-1">
              Store Name <span className="text-red-500">*</span>
            </label>
            <input
              name="storeName"
              type="text"
              className="w-full pt-[18px] pb-[19px] pl-[25px] rounded-[10px] border border-[#DDDDDD] focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
              placeholder="Enter store name"
              {...register("storeName")}
            />
            <p className="text-xs text-red-600 font-semibold h-4">
              {formState.errors.storeName?.message}
            </p>

            <label className="text-[#52575C] text-[16px] font-semibold mb-[8px] mt-[20px]">
              Business Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              className="w-full pt-[18px] pb-[19px] pl-[25px] rounded-[10px] border border-[#DDDDDD] text-[#B0B3B6] focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
              {...register("type")}
            >
              <option value="">--Select business type--</option>
              <option value="Individual">Individual</option>
              <option value="Small Business">Small Business</option>
              <option value="Company">Company</option>
            </select>
            <p className="text-xs text-red-600 font-semibold h-4">
              {formState.errors.type?.message}
            </p>

            <label className="text-[#52575C] text-[16px] font-semibold mb-[8px] mt-[20px]">
              Business Reg No. <span className="text-red-500">*</span>
            </label>
            <input
              name="registrationNumber"
              type="number"
              className="w-full pt-[18px] pb-[19px] pl-[25px] rounded-[10px] border border-[#DDDDDD] focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
              placeholder="Enter business reg no."
              {...register("registrationNumber", { valueAsNumber: true })}
            />
            <p className="text-xs text-red-600 font-semibold h-4">
              {formState.errors.registrationNumber?.message}
            </p>

            <label className="text-[#52575C] text-[16px] font-semibold mb-[8px] mt-[20px]">
              Business Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="businessAddress"
              rows="4"
              className="w-full pt-[18px] pb-[19px] pl-[25px] rounded-[10px] border border-[#DDDDDD] resize-none  focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
              placeholder="Street, City, State"
              {...register("address")}
            ></textarea>
            <p className="text-xs text-red-600 font-semibold h-4">
              {formState.errors.address?.message}
            </p>

            <div className="flex flex-col md:flex-row gap-4 mt-5">
              <div className="md:w-1/2">
                <label className="text-[#52575C] text-[16px] font-semibold">
                  Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  name="zipCode"
                  type="number"
                  className="w-full pt-[18px] pb-[19px] pl-[25px] rounded-[10px] border border-[#DDDDDD] focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                  placeholder="Enter zip code"
                  {...register("zipCode", { valueAsNumber: true })}
                />
                <p className="text-xs text-red-600 font-semibold h-4">
                  {formState.errors.zipCode?.message}
                </p>
              </div>

              <div className="md:w-1/2">
                <label className="text-[#52575C] text-[16px] font-semibold mb-[8px] mt-[20px]">
                  Country <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder={<div>Country</div>}
                  options={countries}
                  menuPlacement="top"
                  isSearchable={true}
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 62,
                      fontSize: "16px",
                      padding: "5px",
                      borderRadius: "10px",
                    }),
                    menu: (base) => ({
                      ...base,
                      fontSize: "16px",
                    }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      backgroundColor: isFocused ? "#EC2F79" : "white",
                      color: isFocused ? "white" : "black",
                      fontSize: "16px",
                      padding: "10px",
                    }),
                  }}
                  getOptionLabel={(e) => (
                    <div className="flex items-center">
                      <span className="mx-2 ">{e.value}</span>
                      <ReactFlagsSelect code={e.code} width={35} />
                    </div>
                  )}
                  onChange={handleCountryChange}
                  value={selectedCountry}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#EC2F79] text-white rounded-[10px] w-full mt-[21px]  pt-[13px] pb-[17.5px] font-man text-[14px]"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  );
};
