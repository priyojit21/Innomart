import React, { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import Modal from "../../components/Helper/Modal";
import { Link } from "react-router-dom";

export default function OfferCards({
  amount,
  code,
  minAmount,
  offerDetails,
  validFromDateTime,
  validTillDateTime,
  offerType,
  id,
  getAllCoupons,
  deleteAddr,
  setDeleteAddr,
}) {
  const [active, setActive] = useState(false);
  const [Id, setId] = useState("");

  const c = 1;

  const accessToken = localStorage.getItem("accessToken");


  return (
    <div className="flex flex-col sm:flex-row border-2 rounded-lg border-gray-200 p-2 w-full xl:p-10 max-w-[801px] bg-[#FFFFFF] h-auto max-h-[200px]">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center sm:w-[35%] border-b sm:border-b-0 sm:border-r border-gray-300 pb-2 sm:pb-0 sm:pr-4">
        <h3 className="text-lg text-[#EC2F79] xl:text-2xl font-man font-bold 3xl:text-[30px]">
          {code}
        </h3>
        <p className="text-[#707070] font-man text-sm mt-[4px]">
          {validFromDateTime.split("T")[0]} to {validTillDateTime.split("T")[0]}
        </p>
      </div>

      {/* Right Section */}
      <div className="flex justify-between items-start sm:w-[60%] mt-2 sm:mt-0 sm:ml-4 xl:ml-6 3xl:ml-[60px] w-full">
        <div>
          {offerType === "flat" ? (
            <h2 className="text-[#0C0C0C] font-man text-[16px] font-semibold mb-2">
              Flat ₹ {amount} OFF
            </h2>
          ) : (
            <h2 className="text-[#0C0C0C] font-man text-[16px] font-semibold mb-2">
              Flat {amount}% OFF
            </h2>
          )}

          <div className="flex items-center gap-2 mb-2">
            <FaCheck className="text-[#A1A4A9] self-start mt-1" />
            <p className="text-base font-man text-[#707070]">
              Minimum Purchase amount ₹{minAmount}.00
            </p>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <FaCheck className="text-[#A1A4A9] self-start mt-1" />
            <p className="text-base font-man text-[#707070] line-clamp-2 overflow-hidden break-words">
              {offerDetails}
            </p>
          </div>
        </div>

        {/* Icons Section (Horizontal Alignment) */}
        <div className="flex items-start gap-3 3xl:gap-5">
          <Link to={`/offers/editCoupon/${id}`}>
            <CiEdit className="text-[#979EAF] cursor-pointer" />
          </Link>
          <RiDeleteBinLine
            className="text-[#979EAF] cursor-pointer"
            onClick={() => {
              setActive(true),
                setDeleteAddr(true),
                setId(id);
            }}
          />
        </div>
      </div>
      <Modal
        active={active}
        setActive={setActive}
        Id={Id}
        setId={setId}
        deleteAddr={deleteAddr}
        setDeleteAddr={setDeleteAddr}
        getAllCoupons={getAllCoupons}
        c={c}
      />
    </div>
  );
}
