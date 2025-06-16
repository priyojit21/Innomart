import React from 'react';
import toast from "react-hot-toast";

export default function Coupon({ code, offerDetails, offerType, validTillDateTime, amount, appliedCoupon,
    setGivenCoupon }) {
    const isApplied = appliedCoupon === code;

    const handleCopy = () => {
        if (isApplied) return;
        setGivenCoupon(code);
        toast.success("Coupon selected");
    };

    return (
        <div>
            <div className={`container mx-auto w-[600px] ${isApplied ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-center py-10 px-20 rounded-lg shadow-md relative">
                    <h3 className="text-xl font-semibold mb-4">
                        {offerType === "flat" ? `₹${amount} OFF` : `${amount}% OFF`}
                    </h3>

                    <div className="flex justify-between items-center mt-5">
                        <div>
                            <span className="border-dashed border text-white px-4 py-2 rounded-l">
                                {code}
                            </span>
                            <span
                                onClick={handleCopy}
                                className={`border border-white bg-white text-purple-600 px-4 py-2 rounded-r cursor-pointer hover:bg-gray-100 transition ${isApplied ? "cursor-not-allowed" : ""}`}
                            >
                                {isApplied ? "Applied" : "Copy Code"}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm">Valid Till {validTillDateTime.split("T")[0]}</p>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6" />
                    <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6" />
                </div>
            </div>
        </div>
    );
}
