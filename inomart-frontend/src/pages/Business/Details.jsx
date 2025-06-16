import React from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../middleware/axiosInterceptor";
import toast, { Toaster } from "react-hot-toast";
import { businessValidation } from "../../validators/businessRegistration";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from 'react-router-dom';

export default function BusinessDetails() {
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(businessValidation),
  });
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken")
  const onSubmit = async (data) => {
    const businessData = {
      storeName: data.storeName,
      type: data.type,
      registrationNumber: (Number)(data.registrationNumber),
      description: data.description,
      businessLicense: data.businessLicense,
      governmentIdType: data.governmentIdType,
      governmentId: data.governmentId,
    };

    try {
      const res = await axiosInstance.post("http://localhost:3000/business/registerBusiness", businessData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/dashboard")
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error);
    }
    reset();
  };

  return (
    <>
      <div className="text-center font-bold font-serif text-lg m-5">
        Welcome to Innomart Business Registration.
      </div>
      <div className="max-w-4xl max-sm:max-w-lg mx-auto font-[sans-serif] p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <label className="text-gray-600 text-sm mb-2 block">Store Name</label>
              <input
                name="storeName"
                type="text"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                placeholder="Enter store name"
                {...register("storeName")}
              />
              {formState.errors.storeName && (
                <p className="text-red-500 text-sm">{formState.errors.storeName.message}</p>
              )}
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">Type</label>
              <select
                name="type"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                {...register("type")}
              >
                <option value="">--Choose from the below--</option>
                <option value="Individual">Individual</option>
                <option value="Small Business">Small Business</option>
                <option value="Company">Company</option>
              </select>
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">Registration Number</label>
              <input
                name="registrationNumber"
                type="number"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                placeholder="Enter registration number"
                {...register("registrationNumber")}
              />
              {formState.errors.registrationNumber && (
                <p className="text-red-500 text-sm">{formState.errors.registrationNumber.message}</p>
              )}
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">Description</label>
              <textarea
                name="description"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                rows="3"
                placeholder="Enter description"
                {...register("description")}
              />
              {formState.errors.description && (
                <p className="text-red-500 text-sm">{formState.errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">Business License</label>
              <input
                name="businessLicense"
                type="text"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                placeholder="Enter business license"
                {...register("businessLicense")}
              />
              {formState.errors.businessLicense && (
                <p className="text-red-500 text-sm">{formState.errors.businessLicense.message}</p>
              )}
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">Government ID Type</label>
              <select
                name="governmentIdType"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                {...register("governmentIdType")}
              >
                <option value="">--Choose from the below--</option>
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Passport">Passport</option>
                <option value="Driver's License">Driver's License</option>
                <option value="PAN">PAN</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">Government ID</label>
              <input
                name="governmentId"
                type="text"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                placeholder="Enter government ID"
                {...register("governmentId")}
              />
              {formState.errors.governmentId && (
                <p className="text-red-500 text-sm">{formState.errors.governmentId.message}</p>
              )}
            </div>

            <div className="mt-8">
              <button className="mx-auto block py-3 px-6 text-sm tracking-wider rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                Register Business
              </button>
            </div>
          </div>
        </form>
      </div>
      <Toaster />
    </>
  );
}

