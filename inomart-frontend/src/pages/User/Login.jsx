import React, { useState } from "react";
import AsideDesign from "../../components/AsideDesign";
import Logo from "../../assets/innomartLogo.svg";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useForm } from "react-hook-form";
import userLoginSchema from "../../validators/userLogin";
import { yupResolver } from "@hookform/resolvers/yup";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../middleware/axiosInterceptor";
import { Link, useNavigate } from "react-router-dom";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";

export const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(userLoginSchema),
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const navigate = useNavigate();
  const items = [
    {
      key: "1",
      label: <Link to={"/register/Customer"}>Customer</Link>,
    },
    {
      key: "2",
      label: <Link to={"/register/Seller"}>Seller</Link>,
    },
  ];
  async function userLogin(data) {
    try {
      const response = await axiosInstance.post(
        "user/login",
        data
      );
      if (response.data.message[0].email === "Invalid email address") {
        return toast.error("Invalid email address");
      }

      // Saving AccessToken and RefreshToken in Local Storage
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      const role = response.data.data.role;
      const userName = response.data.data.username;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("userName", userName);

      // console.log("Response: ", response);
      if (response.data.success && role === "Seller") {
        toast.success(response.data.message);
        reset();
        try {
          const res = await axiosInstance.get(
            "http://localhost:3000/business/checkBusiness",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          localStorage.setItem("detailsStatus", res.data.status);
          if (res.data.success) {
            const businessId = res.data.data._id;
            localStorage.setItem("businessId", businessId);
            switch (res.data.status) {
              case 1:
                navigate("/businessInfo");
                break;
              case 2:
                navigate("/paymentDetails");
                break;
              case 3:
                navigate("/storeSetUp");
                break;
              case 4:
                navigate("/storeSetUp2");
                break;
              case 5:
                navigate("/agreement");
                break;
              case 6:
                navigate("/sellerHome");
                break;
              default:
                navigate("/sellerHome");
            }
          }
        } catch (error) {
          localStorage.setItem("detailsStatus", 1);
          navigate("/businessInfo");
          console.log("Error Occurred: ", error);
        }
      } else if (response.data.success && role === "Customer") {
        navigate("/product/customer");
      }
    } catch (error) {
      console.log("Error Occurred: ", error);
      toast.error(error.response?.data.message);
    }
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full">
        <div className="lg:w-[50%]">
          <AsideDesign />
        </div>
        <div className="w-full lg:w-[50%] h-screen flex flex-col justify-center items-center bg-[#F7F7F7] px-4">
          <img
            src={Logo}
            className="w-[93.11px] h-[88.46px] mb-[46.54px]"
            alt="InnoMart Logo"
          />
          <h1 className="font-man text-[24px] xs:text-[30px] font-semibold mb-[57px] ">
            Welcome to InnoMart
          </h1>
          <form
            className="w-full max-w-[354px]"
            onSubmit={handleSubmit(userLogin)}
          >
            <label className="font-man text-[16px] font-semibold text-[#52575C] flex items-center gap-1 mb-[8px]">
              Email Address <span className="text-red-500 mt-1">*</span>
            </label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              className="w-full pt-[18px] pb-[19px] pl-[25px] rounded-[10px] border border-[#DDDDDD] sm:w-full focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
              placeholder="Enter email address"
              {...register("email")}
            />
            <label className="font-man text-[16px] font-semibold text-[#52575C] flex items-center gap-1 mb-[8px] mt-[20px]">
              Password <span className="text-red-500 mt-1">*</span>
            </label>
            <div className="relative">
              <input
                name="password"
                type={passwordVisible ? "text" : "password"}
                autoComplete="new-password"
                className="w-full pt-[18px] pb-[19px] pl-[25px] pr-[40px] rounded-[10px] border border-[#DDDDDD] focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                placeholder="Enter password"
                {...register("password")}
              />
              <p className="text-xs text-red-600 font-semibold h-6">
                {formState.errors.password?.message}
              </p>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-[10px] transform -translate-y-5"
              >
                {passwordVisible ? (
                  <FaEye color={"#EC2F79"} />
                ) : (
                  <FaEyeSlash color={"#EC2F79"} />
                )}
              </button>
            </div>
            <Link
              to="/forgetPassword"
              className="block pt-[25px] text-center text-[#2F36F4]"
            >
              Forgot Password?
            </Link>
            <button
              type="submit"
              className="bg-[#EC2F79] text-white rounded-[10px] w-full mt-[21px] pt-[13px] pb-[17.5px] font-man text-[14px]"
            >
              Login
            </button>
          </form>
          <div className="flex flex-col items-center md:flex-row md:items-end gap-2">
            <p className="text-center mt-[25px]">Don't have an account ? </p>
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  Register Now
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </div>
      </div>
      <Toaster></Toaster>
    </>
  );
};
