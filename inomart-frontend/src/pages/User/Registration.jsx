import React, { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useForm } from "react-hook-form";
import userSchema from "../../validators/userRegistration.js";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../middleware/axiosInterceptor.js";
import toast, { Toaster } from "react-hot-toast";
import AsideDesign from "../../components/AsideDesign.jsx";
import Logo from "../../assets/innomartLogo.svg";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Registration() {
  const [toggle, setToggle] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(userSchema),
  });
  const navigate = useNavigate();
  const { role } = useParams();

  const onSubmit = async (data) => {
    const fullName = data.fName.split(" ");
    const firstName = fullName[0];
    fullName.shift();
    let lastName = fullName.join(" ");

    if (!lastName) {
      lastName = firstName;
    }

    const registerData = {
      firstName: firstName,
      lastName: lastName,
      email: data.email,
      password: data.password,
      role: role,
      phoneNumber: data.phoneNumber,
    };

    try {
      const res = await axiosInstance.post(
        "http://localhost:3000/user/register",
        registerData
      );
      if (res.data.success) {
        toast.success(res.data.message);
        reset()
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 429) {
        toast.error("Too many requests, please try again later.");
      } else {
        toast.error(error.response?.data.error || "An error occurred.");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full ">
        <div className="lg:w-[50%]">
          <AsideDesign />
        </div>

        <div className="w-full min-h-screen  lg:w-[50%]  flex flex-col justify-center items-center px-4 bg-[#F7F7F7] gap-[10px] xl-plus:gap-[46.54px]  pb-[5px] pt-[15px] md:py-[5px]">
          <img
            src={Logo}
            className="w-[75px]  xl-plus:w-[93.11px]  "
            alt="InnoMart Logo"
          />
          <h1 className="font-man text-[24px] xs:text-[30px] md:text-[30px] font-semibold  text-[#0C0C0C] xl-plus:mb-[10px]">
            Create your account
          </h1>
          <form
            className="w-full  max-w-[354px] flex flex-col gap-[10px] xl-plus:max-w-[429px] xl-plus:gap-[14px]"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <div>
              <label className="font-man text-[16px] font-semibold text-[#52575C] flex items-center gap-1 mb-[5px] xl-plus:mb-[8px]">
                Full Name <span className="text-[#F42020] mt-1">*</span>
              </label>
              <input
                name="fname"
                type="text"
                className=" w-full  py-[10px] xl-plus:py-[10px] xl-plus:pt-[18px] xl-plus:pb-[19px]   pl-[25px] rounded-[10px] border border-[#DDDDDD] sm:w-full   focus:outline-none"
                placeholder="Enter your name"
                {...register("fName")}
              />
              <p className="text-xs text-red-600 font-semibold h-4">
                {formState.errors.fName?.message}
              </p>
            </div>

            <div>
              <label className="font-man text-[16px] font-semibold text-[#52575C] flex items-center gap-1 mb-[5px] xl-plus:mb-[8px]">
                Email Address <span className="text-[#F42020] mt-1">*</span>
              </label>
              <input
                name="email"
                type="text"
                className=" w-full  py-[10px] xl-plus:pt-[18px] xl-plus:pb-[19px]  pl-[25px] rounded-[10px] border border-[#DDDDDD] sm:w-full   focus:outline-none"
                placeholder="Enter email address "
                {...register("email")}
              />
              <p className="text-xs text-red-600 font-semibold h-4">
                {formState.errors.email?.message}
              </p>
            </div>

            <div className="relative">
              <label className="font-man text-[16px] font-semibold text-[#52575C] flex items-center gap-1 mb-[5px] xl-plus:mb-[8pxc]">
                Phone Number <span className="text-[#F42020] mt-1">*</span>
              </label>


              <input
                name="phoneNumber"
                type="number"
                className="w-full  py-[10px] xl-plus:pt-[18px] xl-plus:pb-[19px]  pl-[25px] rounded-[10px] border border-[#DDDDDD] sm:w-full   focus:outline-none"
                placeholder="Enter phone number"
                {...register("phoneNumber")}

              />

              <p className="text-xs text-red-600 font-semibold h-4">
                {formState.errors.phoneNumber?.message}
              </p>
            </div>

            <div>
              <label className="font-man text-[16px] font-semibold text-[#52575C] flex items-center gap-1 mb-[5px] xl-plus:mb-[8px]">
                Password <span className="text-[#F42020] mt-1">*</span>
              </label>
              {!toggle && (
                <div className="relative">
                  <input
                    className="w-full  py-[10px] xl-plus:pt-[18px] xl-plus:pb-[19px]  pl-[25px] rounded-[10px] border border-[#DDDDDD] sm:w-full   focus:outline-none"
                    type="password"
                    placeholder="Enter password"
                    required
                    {...register("password")}
                  />
                  <p className="text-xs text-red-600 font-semibold h-4">
                    {formState.errors.password?.message}
                  </p>
                  <FaEyeSlash
                    color={"#EC2F79"}
                    className="absolute top-[1rem] right-[1.25rem] xl-plus:top-[1.35rem]"
                    onClick={() => setToggle(true)}
                  />
                </div>
              )}
              {toggle && (
                <div className="relative">
                  <input

                    className="w-full  py-[10px] xl-plus:pt-[18px] xl-plus:pb-[19px]  pl-[25px] rounded-[10px] border border-[#DDDDDD] sm:w-full  focus:outline-none"
                    type="text"
                    placeholder="Enter password"
                    required
                    {...register("password")}
                  />
                  <p className="text-xs text-red-600 font-semibold h-4">
                    {formState.errors.password?.message}
                  </p>
                  <FaEye
                    color={"#EC2F79"}
                    className="absolute top-[1rem]  xl-plus:top-[1.35rem] right-[1.25rem]"
                    onClick={() => setToggle(false)}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="font-man text-[16px] font-semibold text-[#52575C] flex items-center gap-1 mb-[5px] xl-plus:mb-[8px]">
                Confirm Password <span className="text-[#F42020] mt-1">*</span>
              </label>
              {!toggle && (
                <div className="relative">
                  <input
                    className="w-full  py-[10px] xl-plus:pt-[18px] xl-plus:pb-[19px]  pl-[25px] rounded-[10px] border border-[#DDDDDD] sm:w-full   focus:outline-none"
                    type="password"
                    placeholder="Confirm password"
                    required
                    {...register("cPassword")}
                  />
                  <p className="text-xs text-red-600 font-semibold h-4">
                    {formState.errors.cPassword?.message}
                  </p>
                </div>
              )}
              {toggle && (
                <div className="relative">
                  <input
                    className="w-full  py-[10px] xl-plus:pt-[18px] xl-plus:pb-[19px]  pl-[25px] rounded-[10px] border border-[#DDDDDD] sm:w-full   focus:outline-none"
                    type="text"
                    placeholder="Confirm password"
                    required
                    {...register("cPassword")}
                  />
                  <p className="text-xs text-red-600 font-semibold h-4">
                    {formState.errors.cPassword?.message}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-center">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-[#2E36F3] font-semibold">
                  Login here
                </Link>
              </p>
            </div>
            <button
              type="submit"
              className="bg-[#EC2F79] text-white rounded-[10px] w-full  pt-[13px] pb-[17.5px] font-man text-[14px] xl-plus:mt-[15px]"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <Toaster></Toaster>
    </>
  );
}
