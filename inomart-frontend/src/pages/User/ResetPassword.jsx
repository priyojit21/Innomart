import React, { useState } from 'react'
import AsideDesign from '../../components/AsideDesign'
import { FaEyeSlash, FaEye } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast, { Toaster } from 'react-hot-toast'
import axiosInstance from '../../middleware/axiosInterceptor'
import { useNavigate } from 'react-router-dom'
import userResetPassword from '../../validators/userResetPassword'

const ResetPassword = () => {
  const navigate = useNavigate()
  const email = localStorage.getItem("email")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [cPasswordVisible, cSetPasswordVisible] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(userResetPassword),
  })

  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev)
  }

  const toggleCPasswordVisibility = () => {
    cSetPasswordVisible(prev => !prev)
  }

  const resetPassword = async (data) => {
    const pass = {
      email: email,
      password: data.password
    }
    try {
      const response = await axiosInstance.post("http://localhost:3000/user/resetPassword", pass)
      if (response.data.success) {
        console.log(response)
        toast.success(response.data.message)
        navigate('/login')
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
            Reset Password?
          </h1>
          <p className="w-[319px] text-center mb-[56px] text-[#5E5F63]">
            Enter your new password to reset your password and login again.
          </p>
          <form className="w-full max-w-[429px]" onSubmit={handleSubmit(resetPassword)}>
            <label className='font-man text-[16px] font-semibold text-[#52575C] flex items-center gap-1 mb-[8px] mt-[20px]'>
              Password <span className='text-red-500 mt-1'>*</span>
            </label>
            <div className='relative'>
              <input
                name='password'
                type={passwordVisible ? 'text' : 'password'}
                autoComplete='new-password'
                className='w-full pt-[18px] pb-[19px] pl-[25px] pr-[40px] rounded-[10px] border border-[#DDDDDD] focus:outline-none focus:ring-2 focus:ring-[#EC2F79]'
                placeholder='Enter password'
                {...register("password")}
              />
              <p className="text-xs text-red-600 font-semibold h-6">
                {errors.password?.message}
              </p>
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='absolute top-[24px] right-[10px]'
              >
                {passwordVisible ? <FaEye color={"#EC2F79"} /> : <FaEyeSlash color={"#EC2F79"} />}
              </button>
            </div>
            <label className='font-man text-[16px] font-semibold text-[#52575C] flex items-center gap-1 mb-[8px] mt-[20px]'>
              Confirm Password <span className='text-red-500 mt-1'>*</span>
            </label>
            <div className='relative'>
              <input
                name='cPassword'
                type={cPasswordVisible ? 'text' : 'password'}
                autoComplete='new-password'
                className='w-full pt-[18px] pb-[19px] pl-[25px] pr-[40px] rounded-[10px] border border-[#DDDDDD] focus:outline-none focus:ring-2 focus:ring-[#EC2F79]'
                placeholder='Enter password'
                {...register("cPassword")}
              />
              <p className="text-xs text-red-600 font-semibold h-6">
                {errors.cPassword?.message}
              </p>
              <button
                type='button'
                onClick={toggleCPasswordVisibility}
                className='absolute top-[24px] right-[10px]'
              >
                {cPasswordVisible ? <FaEye color={"#EC2F79"} /> : <FaEyeSlash color={"#EC2F79"} />}
              </button>
            </div>
            <button
              type='submit'
              className="bg-[#EC2F79] text-white rounded-[10px] w-full mt-[21px] pt-[13px] pb-[17.5px] font-man text-[14px]">
              Save
            </button>
          </form>
        </div>
      </div>
      <Toaster></Toaster>
    </>
  )
}

export default ResetPassword
