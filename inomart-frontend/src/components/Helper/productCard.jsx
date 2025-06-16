import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
    addToWishlist,
    removeFromWishlist,
    handleCartItems,
} from "../../features/productDetailSlice";
import axiosInstance from "../../middleware/axiosInterceptor";

export const ProductCard = ({
    productName,
    productPrice,
    productImage,
    productId,
    variationId,
}) => {
    const dispatch = useDispatch();
    const wishlistItems = useSelector((state) => state.app.wishlistItems);
    const isInWishlist = wishlistItems?.some(
        (item) => item.productId === productId
    );

    const addToCart = async () => {
        try {
            const data = { productId, variationId };
            const response = await axiosInstance.post("cart/addItems", data);
            dispatch(handleCartItems());
            if (response.data.success) toast.success(response.data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error adding to cart");
        }
    };

    const handleWishlistToggle = () => {
        if (isInWishlist) {
            dispatch(removeFromWishlist({ productId, variationId })).then((res) => {
                if (res.meta.requestStatus === "fulfilled") {
                    toast.success("Removed from wishlist");
                }
            });
        } else {
            dispatch(addToWishlist({ productId, variationId })).then((res) => {
                if (res.meta.requestStatus === "fulfilled") {
                    toast.success("Added to wishlist");
                }
            });
        }
    };

    return (
        <div className="relative group z-10">
            <Link
                to={`/product/customer/get/${productId}`}
                className="flex flex-col w-[257px] px-[30px] h-[301px] justify-center items-center bg-white rounded-[20px] transition-transform duration-300 group-hover:scale-[1.05] group-hover:bg-[#30333B4D]"
            >
                <div className="transition-all duration-300 group-hover:blur-sm">
                    <img
                        src={productImage}
                        className="w-[115px] h-[115px]"
                        loading="lazy"
                        alt="product"
                    />
                </div>
                <div className="transition-all duration-300 group-hover:blur-[10px] w-11/12">
                    <p className="text-center text-[#0C0C0C] pt-[34px] font-semibold font-man text-md cursor-default line-clamp-2">
                        {productName}
                    </p>
                </div>
                <div className="transition-all duration-300 group-hover:blur-sm">
                    <p className="pt-[29px] font-man font-bold text-md text-[#EC2F79]">
                        ₹{productPrice}
                    </p>
                </div>
            </Link>

            <div className="absolute top-[50%] right-[28%] transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-50">
                <button
                    className="px-[20px] py-[5px] rounded-[10px] bg-[#EC2F79] text-white font-bold font-man text-[14px]"
                    onClick={addToCart}
                >
                    Add to Cart
                </button>
            </div>

            <div className="absolute top-[5%] left-[10px] transition-opacity duration-300 opacity-100 z-30">
                <button onClick={handleWishlistToggle}>
                    <FaHeart color={isInWishlist ? "#EC2F79" : "#FFFFFF"} size={20} />
                </button>
            </div>

            <Toaster />
        </div>
    );
};

