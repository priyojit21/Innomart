import React, { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import axiosInstance from '../../middleware/axiosInterceptor';
import toast, { Toaster } from "react-hot-toast";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const referenceNum = searchParams.get("reference");
  const { width, height } = useWindowSize();
  const orderId = localStorage.getItem("orderId");

  const hasSentInvoice = useRef(false);

  const sendInvoice = async () => {
    try {
      if (!orderId) {
        console.error("Order ID not found in localStorage.");
        return;
      }

      await axiosInstance.post(`/order/generateInvoice/${orderId}`);
      toast.success("Invoice sent to your email");
    } catch (error) {
      console.error("Invoice error:", error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!hasSentInvoice.current) {
      hasSentInvoice.current = true;
      sendInvoice();
    }
  }, []);

  return (
    <div>
      <Confetti width={width} height={height} />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="w-full max-w-2xl p-12 mx-4 text-center bg-white shadow-lg rounded-xl">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-green-100 rounded-full">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mb-6 text-4xl font-extrabold text-green-600">Payment Successful!</h1>
          <p className="mb-8 text-xl text-gray-700">Thank you for your purchase.</p>
          <div className="p-6 mb-8 rounded-lg bg-blue-50">
            <p className="text-lg font-medium text-blue-700">
              Your Reference Number : <span className="font-bold">{referenceNum}</span>
            </p>
          </div>
          <div className="pt-8 mt-8 border-t border-gray-100">
            <p className="text-lg text-gray-700">Have questions? Contact us at:</p>
            <Link to="mailto:admin@eliteai.tools" className="inline-block mt-2 text-xl font-medium text-blue-600 hover:text-blue-800">
              admin@eliteai.tools
            </Link>
          </div>
          <div className="mt-12">
            <Link to="/product/customer" className="px-8 py-4 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
