import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../middleware/axiosInterceptor";
import email from "../../assets/emailVerify/checkMail.png";
import { Link } from "react-router-dom";

const Verify = () => {
  const [message, setMessage] = useState("");
  const params = useParams();
  const verifyToken = params.token;
  console.log(params);

  const Verification = async () => {
    try {
      const res = await axiosInstance.post(`http://localhost:3000/user/verify`, {}, {
        headers: {
          Authorization: `Bearer ${verifyToken}`,
        },
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data.error);
    }
  };
  useEffect(() => {
    Verification();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F7F7F7] font-man">
      <div className="flex flex-col items-center justify-center bg-white rounded-[20px] gap-[24px] p-[16px] md:gap-[32px] md:p-[32px] lg:gap-[40px] lg:p-[48px] xl:gap-[47px] xl:p-[82px] w-[90%] md:w-[58vw] lg:w-[46vw] xl:w-[37vw] 2xl:w-[29vw]">
        <img className="w-[30%] sm:w-[15%] md:w-[80px] lg:w-[100px] font-semibold" src={email} alt="Email" />
        <div className="text-center font-semibold text-[24px] md:text-[30px]"> {message} </div>
        <p className="text-[14px]  text-[#6A6A6A] text-center">
          Thank you for verifying your email. You can now explore all features of your account.
        </p>
        <Link to={"/login"}>
          <button className="text-[14px] bg-[#EC2F79] text-white rounded-[10px] px-4 py-3">Back to Login</button>
        </Link>

      </div>
    </div>
  );
};


export default Verify;
