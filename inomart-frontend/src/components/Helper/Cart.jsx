import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { SlMinus } from "react-icons/sl";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import Modal from "./Modal";
import emptyCart from "../../assets/cart/emptyCart.png";
import { useDispatch, useSelector } from "react-redux";
import { handleCartItems } from "../../features/productDetailSlice";
import axiosInstance from "../../middleware/axiosInterceptor";
import Coupon from "./Coupon";
import LoyaltyCoupons from "./LoyaltyCoupons";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default function Cart({ isSidebarOpen, setIsSidebarOpen }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.app.cartItems);
  const cartIds = useSelector((state) => state.app.cartIds);
  const prodIds = useSelector((state) => state.app.prodIds);
  const varIds = useSelector((state) => state.app.varIds);




  const accessToken = localStorage.getItem("accessToken");


  const [flag, setFlag] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [originalSubtotal, setOriginalSubtotal] = useState(0);
  const [givenCoupon, setgivenCoupon] = useState('');
  const [failedVarId, setFailedVarId] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [active, setActive] = useState(false);
  const [prodId, setProdId] = useState("");
  const [varId, setVarId] = useState("");
  const [getId, setuserId] = useState("");
  const [address, setAddress] = useState(null);
  const [coupon, setCoupon] = useState([]);
  const [firstBuy, setfirstBuy] = useState(0);
  const [code, setCode] = useState("");
  const [userDetails, setUserDetails] = useState({
    userName: "",
    email: "",
    phone: "",
  });
  const shippingFee = 30;
  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(total);
    setOriginalSubtotal(total);
  }, [cartItems]);

  const handleAdd = async (productId, variationId) => {
    try {
      await axiosInstance.post(
        "http://localhost:3000/cart/addItems",
        {
          productId,
          variationId,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      dispatch(handleCartItems());
      setFlag(flag + 1)
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error adding item");
    }
  };

  const handleDelete = async (productId, variationId) => {
    try {
      await axiosInstance.delete(
        `http://localhost:3000/cart/removeFromCart/${productId}/${variationId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      dispatch(handleCartItems());
      setFlag(flag + 1)

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error removing item");
    }
  };
  const getAllAddress = async () => {
    try {
      const res = await axiosInstance.get("user/getAddress");
      if (res.data.data.length > 0) {
        setAddress(res.data.data[0].userId.defaultAddressId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const orderNow = async () => {
    try {
      const data = {
        cartIds,
        addressId: address,
      };

      const res = await axiosInstance.post(
        "http://localhost:3000/order/addOrderItems",
        data,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      localStorage.setItem("orderId", res.data.allOrder._id);
      const amount = subtotal + shippingFee;
      await checkoutHandler(amount);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  const checkoutHandler = async (amount) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay failed to load!!");
      return;
    }

    try {
      const {
        data: { key },
      } = await axiosInstance.get("http://localhost:3000/payment/getKey");

      const orderId = localStorage.getItem("orderId");

      const respon = await axiosInstance.post(
        `http://localhost:3000/payment/checkout/${orderId}`,
        { amount },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const order = respon.data.order;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Inomart",
        description: "Test Transaction",
        image:
          "https://raw.githubusercontent.com/priyojit-itobuz/innomartLogo/refs/heads/main/innomartLogo.svg",
        order_id: order.id,
        callback_url: `http://localhost:3000/payment/paymentVerification/${getId}`,
        prefill: {
          name: userDetails?.userName,
          email: userDetails?.email,
          contact: userDetails?.phone,
        },
        notes: {
          address: "Inomart Corporate Office",
        },
        theme: {
          color: "#EC2F79",
        },
      };

      const razor = new window.Razorpay(options);
      razor.on("payment.failed", async function (res) {
        toast.error("Payment failed!");
        try {
          await axiosInstance.post(
            "http://localhost:3000/payment/paymentFailed",
            {
              razorpay_order_id: order.id,
              razorpay_payment_id: res.error.metadata.payment_id,
            },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
        } catch (error) {
          console.error("Error updating payment status:", error);
        }
      });

      razor.open();
    } catch (error) {
      const failedId = error.response?.data?.data;
      if (failedId) {
        setFailedVarId(failedId);
      }
      toast.error(error.response?.data?.message || "Error occurred");
      console.error(error);
    }
  };

  const getUserDetails = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axiosInstance.get(
        "http://localhost:3000/user/getUser ",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setuserId(response.data.userProfile.details._id);

      const user = response.data.userProfile.details;
      setUserDetails({
        userName: user.firstName + " " + user.lastName,
        email: user.email,
        phone: user.phoneNumber,
      });
    } catch (error) {
      console.log("Error occurred", error);
      toast.error(error.response.data.message || "Error Occurred");
    }
  };

  const getCoupons = async () => {
    const data = {
      productIds: prodIds,
      variationIds: varIds,
      categories: [""],
    };
    try {
      const response = await axiosInstance.post(
        "http://localhost:3000/product/getOrderCoupon", data,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }

      );
      console.log("my res", response);
      setCoupon(response?.data?.coupons)
      setfirstBuy(response?.data?.BuyerFirstPurchase);
      if (firstBuy === 0) {
        setCode("FIRST001")
      }
      else if (firstBuy > 3) {
        setCode("LOYALTY100")
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleApplyCoupon = (e) => {
    setgivenCoupon(e.target.value);
  }


  const discountedPrice = async () => {
    const data = {
      code: givenCoupon,
      totalAmount: originalSubtotal,
      productIds: prodIds,
      variationIds: varIds,
      categories: [""],
    };
    try {
      const response = await axiosInstance.post(
        "http://localhost:3000/product/applyCoupon",
        data,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setSubtotal(response.data.discountedAmount);
      setAppliedCoupon(givenCoupon);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error);
    }
  };

  useEffect(() => {
    getAllAddress();
    getUserDetails();
    getCoupons();
  }, [flag]);

  useEffect(() => {
    if (firstBuy === 0) {
      setCode("FIRST001");
    } else if (firstBuy > 3) {
      setCode("LOYALTY100");
    } else {
      setCode("");
    }
  }, [firstBuy]);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-start z-40">
        <div
          className="bg-white w-full sm:w-96 xl:w-[700px] p-4 sm:p-6 max-h-screen overflow-y-auto transform transition-transform duration-300 ease-in-out"
          style={{
            transform: isSidebarOpen ? "translateX(0)" : "translateX(100%)",
            height: "100vh",
          }}
        >
          <button
            className="absolute top-4 right-4 text-xl bg-[#dfdede] text-gray-600 w-8 h-8 rounded-md"
            onClick={() => setIsSidebarOpen(false)}
          >
            <RxCross2 className="mx-auto" />
          </button>
          <h2 className="text-[16px] lg:text-[20px] font-medium text-[#0C0C0C] font-man mb-4">
            Cart Details
          </h2>

          {!cartItems?.length ? (
            <section className="flex justify-center items-start">
              <img src={emptyCart} alt="empty cart" />
            </section>
          ) : (
            <section>
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row justify-between items-start mt-4 lg:mt-[30px] xl:mt-[41px] border-b-2 "
                >
                  <div
                    className={`flex gap-3 xl:gap-6 mb-4 ${item?.variationId === failedVarId ? "opacity-50 " : ""
                      }`}
                  >
                    <img
                      src={item?.productImages[0]}
                      alt="product"
                      className="rounded-lg w-20 h-20 sm:w-32 sm:h-32"
                    />
                    <div className="flex flex-col w-full gap-1 text-[#0C0C0C] font-semibold font-man xl:text-[18px]">
                      <p className="text-sm sm:text-base xl:w-[290px] font-man font-semibold">
                        {item?.productName}
                      </p>
                      <div className="flex gap-3 items-center">
                        <p className="text-[#EC2F79] font-bold font-man xl:text-[18px]">
                          <span>&#8377;</span> {item?.price}
                        </p>
                      </div>
                      {item?.variationId === failedVarId && (
                        <p className="text-red-500 text-sm font-normal">
                          Insufficient stock for this item
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center flex-col sm:flex-row gap-3 xl:gap-8 mb-4">
                    <div
                      className={`flex gap-3 items-center ${item?.variationId === failedVarId
                        ? "opacity-50  pointer-events-none"
                        : ""
                        }`}
                    >
                      <button>
                        <SlMinus
                          className="text-[#919191]"
                          size={25}
                          onClick={() =>
                            handleDelete(item?.productId, item?.variationId)
                          }
                        />
                      </button>
                      <p className="font-man font-bold">{item?.quantity}</p>
                      <button>
                        <IoAddCircleOutline
                          size={30}
                          className="text-[#919191]"
                          onClick={() =>
                            handleAdd(item?.productId, item?.variationId)
                          }
                        />
                      </button>
                    </div>
                    <div>
                      <MdOutlineDeleteOutline
                        className="text-[#919191] cursor-pointer"
                        size={30}
                        onClick={() => {
                          setActive(true);
                          setProdId(item?.productId);
                          setVarId(item?.variationId);
                          setFlag(flag + 1)
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="xl:mt-[29px] flex flex-row gap-x-14 justify-between">
                <div className="flex flex-col gap-2 xl:gap-4 list-none">
                  <li className="text-[#707070] font-man">SubTotal</li>
                  <li className="text-[#707070] font-man">Shipping fee</li>
                  <li className="text-[#707070] font-man">Total</li>
                </div>
                <div className="flex flex-col gap-2 xl:gap-4 list-none">
                  <li className="text-[#0C0C0C] font-man font-semibold">
                    <span>&#8377;</span>
                    {subtotal}
                  </li>
                  <li className="text-[#0C0C0C] font-man font-semibold">
                    <span>&#8377;</span>
                    {shippingFee}
                  </li>
                  <li className="text-[#EC2F79] font-man font-semibold text-[20px]">
                    <span>&#8377;</span>
                    {subtotal + shippingFee}
                  </li>
                </div>
              </div>

              <div className="flex gap-5 justify-center items-center mt-[30px] lg:mt-[45px] xl:mt-[64px]">
                <p className="text-[#0C0C0C] font-man">Apply Coupon:</p>
                <div
                  id="search-bar"
                  className="w-120 bg-white rounded-md shadow-lg z-10 "
                >
                  <form className="flex items-center justify-center p-2">
                    <input
                      type="text"
                      value={givenCoupon}
                      onChange={handleApplyCoupon}
                      placeholder="Add coupon code here"
                      className="w-full rounded-md px-2 py-1 focus:outline-none  border-b-1 border-[#E7E7E7]"
                    />
                    <button
                      type="button"
                      className="bg-[#FFEBF3] text-[#EC2F79] rounded-md px-4 py-2 ml-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      onClick={discountedPrice}
                    >
                      Apply
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                {coupon?.map((item, index) => (
                  <div key={index}>
                    <Coupon
                      code={item.code}
                      offerDetails={item.offerDetails}
                      offerType={item.offerType}
                      validTillDateTime={item.validTillDateTime}
                      amount={item.amount}
                      appliedCoupon={appliedCoupon}
                      setGivenCoupon={setgivenCoupon}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 ">
                <LoyaltyCoupons
                  code={code}
                  offerDetails="Hebbi Offer"
                  offerType="Flat"
                  firstBuy={firstBuy}
                  amount={30}
                  appliedCoupon={appliedCoupon}
                  setGivenCoupon={setgivenCoupon}
                />
              </div>



              <div className="flex gap-4 justify-center items-center mt-[100px] lg:mt-[150px] xl:mt-[250px]">
                <button
                  type="submit"
                  className="bg-[#F1F1F1] text-[#0C0C0C] font-bold rounded-[10px] font-man flex items-center gap-1 py-4 px-6 "
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#EC2F79] text-white font-man font-bold rounded-[10px]  flex items-center gap-1 py-4 px-6 hover:bg-[#f92174]"
                  onClick={orderNow}
                >
                  Check out now
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
      {active && (
        <Modal
          active={active}
          setActive={setActive}
          prodId={prodId}
          varId={varId}
          c={2}
          flag={flag}
          setFlag={setFlag}
          handleCartItems={() => dispatch(handleCartItems())}
        />
      )}
      <Toaster />
    </>
  );
}
