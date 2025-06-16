import { useDispatch } from "react-redux";
import CancelModal from "./CancelModal";
import { useEffect, useState } from "react";
import { showUser } from "../../features/productDetailSlice";
import ProductSidebar from "../Helper/ProductSidebar";
import ReviewModal from "./ReviewModal";
const formatDate = (date) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
};
const getLastThreeDigits = (orderId) => {
  return orderId.slice(-3);
};

export default function GetOrderCards({
  price,
  quantity,
  productName,
  orderAt,
  deliverAt,
  productImage,
  orderId,
  status,
  item,
  address,
  productId,
  paymentStatus,
  flag,
  setFlag
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [myProduct, setmyProduct] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleAddReview = () => {
    setReviewModalOpen(true);
  };

  const handleOpenSidebar = (product) => {
    setSelectedProduct(product);
    setIsSidebarOpen(true);
    console.log("hello")
    setFlag(!flag)
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setFlag(!flag)
    setSelectedProduct(null);
  };
  return (
    <>
      <div className="flex flex-col gap-2 md:gap-4 m-4 bg-[#FFFFFF] p-3 rounded-xl md:flex-row md:justify-between md:p-7 md:my-5 md:mx-0 md:items-start">
        <div className="self-center ">
          <img src={productImage} className="w-[145px] h-[145px]" alt="" />
        </div>
        <div className="md:max-w-[120px] 2xl:max-w-[200px] flex flex-col gap-[3px] md:gap-[9px]">
          <p className="text-[#707070] text-[14px]">
            Order # {getLastThreeDigits(orderId)}
          </p>
          <p className="font-medium">{productName}</p>
          <p className="text-[#EC2F79] font-semibold mt-[11px]">{price}</p>
        </div>
        <div>
          <p className="text-[#707070]">Order Placed:</p>
          <p className="font-medium">{formatDate(orderAt)}</p>
        </div>
        <div className="w-1/4">
          <p className="text-[#707070]">Ship to:</p>
          <p className="font-medium line-clamp-3 overflow-hidden w-full">
            {address?.houseNo} {address?.street} {address?.city},
            {address?.pinCode}
          </p>
        </div>
        <div>
          <p className="text-[#707070]">Qty:</p>
          <p className="font-medium">{quantity}</p>
        </div>
        <div>
          <p className="text-[#707070]">Delivery Date:</p>
          <p className="font-medium">{formatDate(deliverAt)}</p>
        </div>
        {paymentStatus === "Failed" ? (
          <>
            <div className="self-center flex md:flex-col gap-3 items-center">
              <p className="flex  justify-center text-red-600  py-2  px-2 xl-plus:px-3 3xl:py-[12px] 3xl:px-[20px]  rounded-md text-base font-man font-extrabold ">
                Transaction Failed
              </p>
            </div>
          </>
        ) : (
          <>
            {" "}
            <div className="self-center flex md:flex-col gap-3 items-center">
              <button
                className="flex  justify-center text-[#FFFFFF] border-0 py-2  px-2 xl-plus:px-3 3xl:py-[18px] 3xl:px-[41px] focus:outline-none bg-[#EC2F79] rounded-md text-sm font-man font-bold "
                onClick={() => {
                  handleOpenSidebar(item);
                  setmyProduct(item);
                }}
              >
                Track Order
              </button>
              {["Cancel Initiated", "Cancel", "Refund"].includes(status) ? (
                <button
                  className="flex items-center text-[#0C0C0C] border-0 py-2 px-4 3xl:py-[18px] 3xl:px-[46px] focus:outline-none bg-[#F1F1F1] rounded-md text-sm font-man font-bold cursor-not-allowed"
                  disabled={true}
                >
                  Cancelled
                </button>
              ) : (
                <button
                  className="flex items-center text-[#0C0C0C] border-0 py-2 px-6 3xl:py-[18px] 3xl:px-[57px] focus:outline-none bg-[#F1F1F1] rounded-md text-sm font-man font-bold "
                  onClick={showModal}
                >
                  Cancel
                </button>
              )}
              {["Delivered", "Cancel Initiated", "Cancel", "Refund"].includes(
                status
              ) && (
                  <button
                    className="flex items-center text-[blue] hover:text-[#EC2F79] hover:scale-105"
                    onClick={handleAddReview}
                  >
                    Write a Review
                  </button>
                )}

              <CancelModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                orderId={orderId}
                status={status}
                flag={flag}
                setFlag={setFlag}
              />
              <ReviewModal
                isReviewModalOpen={isReviewModalOpen}
                setReviewModalOpen={setReviewModalOpen}
                productId={productId}
              />
            </div>
          </>
        )}

        <ProductSidebar
          key={selectedProduct?._id}
          isOpen={isSidebarOpen}
          product={selectedProduct}
          onClose={handleCloseSidebar}
          myProduct={myProduct}
          setmyProduct={setmyProduct}
          role="Customer"

        />
      </div>
    </>
  );
}
