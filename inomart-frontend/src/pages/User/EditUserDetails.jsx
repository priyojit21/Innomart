import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axiosInstance from "../../middleware/axiosInterceptor.js";
import toast, { Toaster } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Navigate } from "react-router-dom";

import Sidebar from "../../components/user/Sidebar";
import Navbar from "../../components/user/Navbar";
import { userNameChange } from "../../validators/updateUserProfile.js";
import { useEffect } from "react";

const EditUserDetails = () => {

    const { register, handleSubmit, formState, reset, setValue } = useForm({
        resolver: yupResolver(userNameChange)
    });
    const navigate = useNavigate();
    const { id } = useParams();
    const accessToken = localStorage.getItem("accessToken");



    async function onSubmit(data) {
        console.log("data: ", data)

        try {
            const response = await axiosInstance.put(
                "http://localhost:3000/user/updateUserName",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            localStorage.setItem("userName", response.data.firstName);
            console.log("Response: ", response)
            if (response.data.success) {
                toast.success(response.data.message || "Profile updated successfully");
                reset();
                navigate("/profile");
            }


        } catch (error) {
            console.log("Error occurred: ", error)
            toast.error(error.response.data.message || "Error Occurred")
        }
    }



    const getUser = async (req, res) => {
        try {
            const response = await axiosInstance.get("http://localhost:3000/user/getUser ", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("this is res", response);
            const { firstName, lastName, phoneNumber } = response.data.userProfile.details;
            setValue('firstName', firstName);
            setValue('lastName', lastName);
            setValue('phoneNumber', phoneNumber);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUser();
    }, [])

    return (
        <>
            <div className="lg:flex items-start">
                <div className="flex-grow">
                    <Sidebar />
                </div>
                <div className="lg:flex lg:flex-col lg:w-full">
                    <Navbar pageName="Edit Profile Details" />
                    <div className="h-screen bg-[#F7F7F7] p-[20px] overflow-scroll flex flex-col items-center ">
                        <p className="font-man font-bold text-[22px] mb-[20px] text-[#5E5F63]">
                            Update Your Profile Information
                        </p>

                        <form
                            className="w-[98%] sm:w-full max-w-[354px] "
                            onSubmit={handleSubmit(onSubmit)}
                        >

                            <label className="text-[#52575C] text-[16px] font-semibold">
                                First Name <span className="text-red-500 mt-1 me-auto">*</span>
                            </label>
                            <input
                                name="firstName"
                                type="text"
                                required
                                className="w-full flex justify-center sm:w-full  pt-[10px] pb-[10px] pl-[25px] mt-[4px] sm:mt-[8px] font-medium rounded-[10px] text-[14px] border border-[#DDDDDD]  focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                                placeholder="Enter First Name"
                                {...register("firstName")}
                            />
                            <p className="text-xs text-red-600 font-semibold h-4">{formState.errors.firstName?.message}</p>

                            <label className="text-[#52575C] text-[16px] font-semibold">
                                Last Name <span className="text-red-500 mt-1 me-auto">*</span>
                            </label>
                            <input
                                name="firstName"
                                type="text"
                                required
                                className="w-full flex justify-center sm:w-full  pt-[10px] pb-[10px] pl-[25px] mt-[4px] sm:mt-[8px] font-medium rounded-[10px] text-[14px] border border-[#DDDDDD]  focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                                placeholder="Enter Last Name"
                                {...register("lastName")}
                            />
                            <p className="text-xs text-red-600 font-semibold h-4">{formState.errors.lastName?.message}</p>

                            <label className="text-[#52575C] text-[16px] font-semibold">
                                Phone Number <span className="text-red-500 mt-1 me-auto">*</span>
                            </label>
                            <input
                                name="phoneNumber"
                                type="text"
                                required
                                className="w-full flex justify-center sm:w-full  pt-[10px] pb-[10px] pl-[25px] mt-[4px] sm:mt-[8px] font-medium rounded-[10px] text-[14px] border border-[#DDDDDD]  focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                                placeholder="Enter Phone Number"
                                {...register("phoneNumber")}
                            />
                            <p className="text-xs text-red-600 font-semibold h-4">{formState.errors.phoneNumber?.message}</p>



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
    )
}

export default EditUserDetails;