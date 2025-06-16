import React from 'react';
import { IoAddOutline } from "react-icons/io5";

export default function AddnewCoupon() {
  return (
    <div className="flex flex-col bg-[#ECECEC] justify-center items-center cursor-pointer sm:flex-row border-2 rounded-lg border-gray-200 p-4 w-full max-w-[801px] h-[200px] max-h-[200px] xl:p-14"> {/* Adjusted padding and max height */}
      <div className='flex gap-2 justify-center items-center'>
        <IoAddOutline size={18} strokeWidth={4} />
        <p className='font-man font-bold text-base xl:text-[18px]'>Add New</p>
      </div>
    </div>
  );
}