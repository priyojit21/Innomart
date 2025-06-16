import React from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../middleware/axiosInterceptor";
import toast, { Toaster } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { businessAddressValidation } from "../../validators/addBusinessAddress";

export default function BusinessAddress() {
  const { register, handleSubmit, formState, reset } = useForm(
    {
      resolver: yupResolver(businessAddressValidation)
    }
  );
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const onSubmit = async (data) => {
    const addressData = {
      country: data.country,
      street: data.street,
      city: data.city,
      state: data.state,
      zipCode: (Number)(data.zipCode),
      addressProof: data.addressProof,
      buildingNo: data.buildingNo,
    };

    try {
      const res = await axiosInstance.post(
        `http://localhost:3000/business/address/${data.businessId}`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
    reset();
  };

  return (
    <>
      <div className="text-center font-bold font-serif text-lg m-5">
        Welcome to Innomart Business Address Registration.
      </div>
      <div className="max-w-4xl max-sm:max-w-lg mx-auto font-[sans-serif] p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <label className="text-gray-600 text-sm mb-2 block">Business ID</label>
              <input
                name="businessId"
                type="text"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                placeholder="Enter Business ID"
                {...register("businessId")}
              />
              {formState.errors.businessId && (
                <p className="text-red-500 text-sm">{formState.errors.businessId.message}</p>
              )}
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">Country</label>
              <input
                name="country"
                type="text"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                placeholder="Enter country"
                {...register("country")}
              />
              {formState.errors.country && (
                <p className="text-red-500 text-sm">{formState.errors.country.message}</p>
              )}
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">Street</label>
              <input
                name="street"
                type="text"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                placeholder="Enter street"
                {...register("street")}
              />
              {formState.errors.street && (
                <p className="text-red-500 text-sm">{formState.errors.street.message}</p>
              )}
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">City</label>
              <input
                name="city"
                type="text"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                placeholder="Enter city"
                {...register("city")}
              />
              {formState.errors.city && (
                <p className="text-red-500 text-sm">{formState.errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">State</label>
              <input
                name="state"
                type="text"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                placeholder="Enter state"
                {...register("state")}
              />
              {formState.errors.state && (
                <p className="text-red-500 text-sm">{formState.errors.state.message}</p>
              )}
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">Zip Code</label>
              <input
                name="zipCode"
                type="number"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                placeholder="Enter zip code"
                {...register("zipCode")}
              />
              {formState.errors.zipCode && (
                <p className="text-red-500 text-sm">{formState.errors.zipCode.message}</p>
              )}
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">Address Proof</label>
              <input
                name="addressProof"
                type="text"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                placeholder="Enter address proof"
                {...register("addressProof")}
              />
              {formState.errors.addressProof && (
                <p className="text-red-500 text-sm">{formState.errors.addressProof.message}</p>
              )}
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">Building Number</label>
              <input
                name="buildingNo"
                type="text"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded transition-all"
                placeholder="Enter building number"
                {...register("buildingNo")}
              />
              {formState.errors.buildingNo && (
                <p className="text-red-500 text-sm">{formState.errors.buildingNo.message}</p>
              )}
            </div>

            <div className="mt-8">
              <button className="mx-auto block py-3 px-6 text-sm tracking-wider rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                Register Business Address
              </button>
            </div>
          </div>
        </form>
      </div>
      <Toaster />
    </>
  );
}
