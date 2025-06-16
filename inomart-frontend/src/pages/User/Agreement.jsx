import React, { useState } from 'react'
import ProgressBar from '../../components/ProgressBar'
import axiosInstance from '../../middleware/axiosInterceptor';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";


export default function Agreement() {
  const [currentStep, setCurrentStep] = useState(5);
  const accessToken = localStorage.getItem("accessToken");
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedPolicy, setIsCheckedPolicy] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleCheckboxChangePolicy = (event) => {
    setIsCheckedPolicy(event.target.checked);
  };

  const handleSubmit = async() => {
    try {
      const response = await axiosInstance.get(
        'http://localhost:3000/user/allData',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      toast.success("Seller Registered successfully");
      localStorage.setItem("detailsStatus",6)
       navigate("/sellerHome");

      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="lg:flex w-full h-screen">
      <div className="lg:w-[28.336%] bg-white p-4">
        <ProgressBar currentStep={currentStep} setCurrentStep={setCurrentStep} />
      </div>

      <div className="w-full lg:w-[71.664%] flex flex-col items-center bg-[#F7F7F7] px-4 overflow-hidden">
        <div className="max-w-4xl w-full py-16 overflow-auto">
          <h2 className="text-2xl text-center font-semibold font-man text-[#0C0C0C] xl:text-[30px] mb-2">Agreement & Consent</h2>
          <p className="text-center font-man text-[#5E5F63] mb-6">Join us today and start managing your business.</p>

          <div className="bg-white rounded-2xl shadow-sm p-8">

            <section className="mb-[34px]">
              <h2 className="text-md lg:text-xl font-man font-semibold text-[#0C0C0C] mb-4 2xl:mb-6">1. Introduction</h2>
              <p className="font-man font-medium text-[#6A6A6A]">
                Welcome to [Your Company Name] ("Company", "we", "our", "us"). These Terms & Conditions ("Terms") govern your use of our website, mobile application, and services (collectively, the "Platform"). By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree, please do not use our services.
              </p>
            </section>

            <section className="mb-[34px]">
              <h2 className="text-md lg:text-xl font-man font-semibold text-[#0C0C0C] mb-4 2xl:mb-6">2. Account Registration</h2>
              <ul className="text-[#6A6A6A] font-man font-medium list-disc pl-5">
                <li>To use certain features, you may need to create an account.</li>
                <li>You are responsible for maintaining the confidentiality of your account information.</li>
                <li>You must be at least 18 years old to use our services.</li>
              </ul>
            </section>

            <section className="mb-[34px]">
              <h2 className="text-md lg:text-xl font-man font-semibold text-[#0C0C0C] mb-4 2xl:mb-6">3. Use of Services</h2>
              <ul className="text-[#6A6A6A] font-man font-medium list-disc pl-5">
                <li>You agree to use our Platform only for lawful purposes.</li>
                <li>Any unauthorized or fraudulent use of our services is strictly prohibited.</li>
                <li>We reserve the right to suspend or terminate your account for any violation of these Terms.</li>
              </ul>
            </section>

            <section className="mb-[34px]">
              <h2 className="text-md lg:text-xl font-man font-semibold text-[#0C0C0C] mb-4 2xl:mb-6">4. Payments & Transactions</h2>
              <ul className="text-[#6A6A6A] font-man font-medium list-disc pl-5">
                <li>All payments must be made through approved payment methods on our Platform.</li>
                <li>We do not store your payment information. Transactions are securely processed through third-party payment providers.</li>
              </ul>
            </section>
          </div>

          <div className='flex flex-col justify-center items-center gap-3 md:flex-row md:gap-0 md:items-start md:justify-between mt-5'>
            <div className='flex flex-col gap-2 lg:gap-4'>
                <div className="flex items-center">
                  <input id="checkbox1" type="checkbox"
                    className="w-4 h-4 mr-3  outline-none focus:ring-offset-4 focus:ring-[#007bff]" onChange={handleCheckboxChange}/>
                  <label htmlFor="checkbox1" className="text-[#707070] font-man ">Agree to Terms & Conditions</label>
                </div>
                <div className="flex items-center">
                  <input id="checkbox1" type="checkbox"
                    className="w-4 h-4 mr-3  outline-none focus:ring-offset-4 focus:ring-[#007bff]" onChange={handleCheckboxChangePolicy}/>
                  <label htmlFor="checkbox1" className="text-[#707070] font-man ">Accept the Privacy Policy</label>
                </div>
            </div>
              <button className={`text-[14px]  text-white rounded-[10px] px-6 py-3 xl:px-10 ${!isChecked || !isCheckedPolicy ? "bg-[#ADADAD] cursor-not-allowed"  : "bg-[#EC2F79] cursor-pointer"}`} onClick={handleSubmit} disabled={!isChecked || !isCheckedPolicy}>Agree</button>
          </div>
        </div>
      </div>
      <Toaster></Toaster>
    </div>
  );
}
