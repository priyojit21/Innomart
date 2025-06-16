import React from 'react'
import AsideDesign from '../../components/AsideDesign'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast, { Toaster } from 'react-hot-toast'
import axiosInstance from '../../middleware/axiosInterceptor.js'
import userForgetPassword from '../../validators/userForgetPassword.js'

const ForgetPassword = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(userForgetPassword),
  })

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('http://localhost:3000/user/forgetPassword', data)
      if (response.data.success) {
        toast.success(response.data.message)
        localStorage.setItem("email", data.email)
        reset()
        navigate('/otpVerify')
      } else {
        toast.error(response.data.message)
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
          <h1 className="font-man text-[30px] mb-[17px] font-semibold">
            Forgot Password?
          </h1>
          <p className="w-[319px] text-center mb-[56px] text-[#5E5F63]">
            Enter your email address to reset your password.
          </p>
          <form className="w-full max-w-[354px]" onSubmit={handleSubmit(onSubmit)}>
            <label className="font-man text-[16px] font-semibold text-[#52575C] flex items-center gap-1 mb-[8px]">
              Email Address <span className="text-red-500 mt-1">*</span>
            </label>
            <input
              name="email"
              type="email"
              className="w-full pt-[18px] pb-[19px] pl-[25px] rounded-[10px] border border-[#DDDDDD] sm:w-full focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
              placeholder="Enter email address"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-600 font-semibold h-4">
                {errors.email?.message}
              </p>
            )}

            <button
              type="submit"
              className="bg-[#EC2F79] text-white rounded-[10px] w-full mt-[21px] pt-[13px] pb-[17.5px] font-man text-[14px]"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default ForgetPassword
