import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import AsideDesign from '../../components/AsideDesign';
import Logo from '../../assets/innomartLogo.svg'
import toast, { Toaster } from 'react-hot-toast'
import axiosInstance from '../../middleware/axiosInterceptor';
import { useNavigate } from 'react-router-dom'

const OtpVerify = () => {
  const navigate = useNavigate()
  const [code, setCode] = useState('');
  const email = localStorage.getItem("email")
  const handleChange = (newCode) => {
    setCode(newCode)
  };
  const verify = async () => {
    const data = {
      email: email,
      otp: code
    }
    try {
      const response = await axiosInstance.post("http://localhost:3000/user/verifyOtp", data)
      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/resetPassword')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log("Error Occurred: ", error);
      toast.error(error.response?.data.message);
    }
  }
  const resend = async () => {
    const data = {
      email: email
    }
    try {
      const response = await axiosInstance.post('http://localhost:3000/user/forgetPassword', data)
      if (response.data.success) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log("Error Occurred: ", error);
      toast.error(error.response?.data.message);
    }
  }

  const renderInput = (props) => (
    <input
      {...props}
      className="border border-[#D1D5DB] rounded-[8px] min-w-16 p-4 m-2 text-[18px] text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
    />
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full">
        <div className="lg:w-[50%]">
          <AsideDesign />
        </div>
        <div className="w-full lg:w-[50%] h-screen flex flex-col justify-center items-center bg-[#F7F7F7] px-6">
          <img
            src={Logo}
            className='w-[93.11px] h-[88.46px] mb-[46.54px]'
            alt='InnoMart Logo'
          />
          <h1 className="font-man text-[30px] mb-[20px] text-[#333]">Verify OTP</h1>
          <p className='w-[300px] text-center mb-[56px] text-[#5E5F63]'>
            One Time Password &#123; OTP &#125; has been sent via SMS.
            Enter the OTP below to verify it.
          </p>
          <OtpInput
            value={code}
            onChange={handleChange}
            numInputs={4}
            isInputNum={true}
            shouldAutoFocus={true}
            renderInput={renderInput}
          />
          <p className='block pt-[25px] text-center text-[#2F36F4]' onClick={resend}>
            Resend OTP
          </p>
          <button
            type="submit"
            className="max-w-72 bg-[#EC2F79] text-white rounded-[10px] w-full mt-[20px] pt-[14px] pb-[16px] font-man text-[16px] hover:bg-[#D1286A] transition-all duration-300"
            onClick={verify}
          >
            Verify OTP
          </button>
        </div>
      </div>
      <Toaster></Toaster>
    </>
  );
};

export default OtpVerify;
