import React, { useState } from "react";
import deleteImage from "../../assets/seller/redDelete.svg";
import { Toaster, toast } from "react-hot-toast";
import axiosInstance from "../../middleware/axiosInterceptor";
import DeleteControlModal from "./DeleteControlModal";


export default function ProductControlModal({
  open,
  setOpen,
  selectedCount,
  selectedProducts,
  setSelectedProducts,
  setDeleteTrigger,
  setUpdateTrigger,
  allProducts,
}) {
  const accessToken = localStorage.getItem("accessToken");

  const selectedEnabledStatuses = selectedProducts.map((id) => {
    const product = allProducts.find((p) => p._id === id);
    return product?.isEnabled;
  });

  const hasEnabled = selectedEnabledStatuses.includes(true);
  const hasDisabled = selectedEnabledStatuses.includes(false);
  const [active, setActive] = useState(false);

  const updateProductStatus = async (status) => {
    if (selectedProducts.length === 0) {
      toast.error("No products selected");
      return;
    }
    try {
      const response = await axiosInstance.put(
        `http://localhost:3000/product/updateStatus`,
        { productIds: selectedProducts, status: status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setUpdateTrigger((prev) => !prev);
        setSelectedProducts([]);
        setOpen(false);
      } else {
        toast.error("Failed to update  products");
      }
    } catch (error) {
      console.error("Status updation error: ", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="flex gap-5 bg-[#FFFFFF] shadow-[#F0F3F5] shadow-xl rounded-lg py-[18px] px-[23px] items-center hover:outline hover:outline-[#EC2F79]">
        <div className="pr-[20px]">
          {selectedCount} <span className="text-[#979EAF]">Selected</span>
        </div>
        <div
          className={`rounded-lg border-[#EBEFF2] border-[1.5px] px-[20px] py-[11px] ${hasDisabled ? "hover:border-black" : ""
            }`}
        >
          <button
            className={`${!hasDisabled
              ? "opacity-50 cursor-not-allowed text-[#BABABA]"
              : "text-[#0D0D0D] hover:border-black hover:cursor-pointer"
              }`}
            disabled={!hasDisabled}
            onClick={() => {
              if (hasDisabled) updateProductStatus(true);
            }}
          >
            Enable
          </button>
        </div>
        <div
          className={`rounded-lg border-[#EBEFF2] border-[1.5px] px-[20px] py-[11px] ${hasEnabled ? "hover:border-black" : ""
            }`}
        >
          <button
            className={` ${!hasEnabled
              ? "opacity-50 cursor-not-allowed text-[#BABABA]"
              : "text-[#0D0D0D]  hover:cursor-pointer"
              }`}
            disabled={!hasEnabled}
            onClick={() => {
              if (hasEnabled) updateProductStatus(false);
            }}
          >
            Disable
          </button>
        </div>
        <div className="flex items-center rounded-lg border-[#EBEFF2] border-[1.5px] px-[18px] py-[9px] gap-[5px] hover:border-[#E03A40] hover:cursor-pointer">
          <span>
            <img src={deleteImage} alt="" />
          </span>
          <button
            className="text-[#E03A40] "
            onClick={() => {
              setActive(true);
            }}
          >
            Delete
          </button>
        </div>
        <div>
          <svg
            id="closeIcon"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
            viewBox="0 0 320.591 320.591"
            onClick={() => {
              setOpen(false);
              setSelectedProducts([]);
            }}
          >
            <path
              d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
              data-original="#000000"
            />
            <path
              d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
              data-original="#000000"
            />
          </svg>
        </div>
        <Toaster />
        <DeleteControlModal
          active={active}
          setActive={setActive}
          selectedProducts={selectedProducts}
          setDeleteTrigger={setDeleteTrigger}
          setSelectedProducts={setSelectedProducts}
          setOpen={setOpen}
        />
      </div>
    </>
  );
}
