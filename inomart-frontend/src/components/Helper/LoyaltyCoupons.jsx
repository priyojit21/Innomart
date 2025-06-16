import React from 'react';
import toast from "react-hot-toast";

export default function LoyaltyCoupons({
    code,
    offerType,
    firstBuy,
    amount,
    appliedCoupon,
    setGivenCoupon,
    validTillDateTime
}) {
    const isApplied = appliedCoupon === code;
    console.log("first bu", firstBuy)
    console.log("code", code)

    const handleCopy = () => {
        if (isApplied) return;
        setGivenCoupon(code);
        toast.success("Coupon selected");
    };

    if (!(firstBuy === 0 || firstBuy > 3)) return null;

    const couponLabel = firstBuy === 0 ? "First Buy" : "Loyalty Coupon";

    return (
        <div className="py-8 px-4">
            <h2 className="text-2xl font-bold text-yellow-700 mb-6 text-center uppercase tracking-widest">
                {couponLabel}
            </h2>
            <div className={`container mx-auto w-[600px] ${isApplied ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white text-center py-10 px-20 rounded-lg shadow-lg relative">
                    <h3 className="text-xl font-semibold mb-4">
                        {offerType === "flat" ? `₹${amount} OFF` : `${amount}% OFF`}
                    </h3>

                    <div className="flex justify-center items-center mt-5">
                        <div>
                            <span className="border-dashed border text-white px-4 py-2 rounded-l">
                                {code}
                            </span>
                            <span
                                onClick={handleCopy}
                                className={`border border-white bg-white text-yellow-700 px-4 py-2 rounded-r cursor-pointer hover:bg-yellow-100 transition ${isApplied ? "cursor-not-allowed" : ""}`}
                            >
                                {isApplied ? "Applied" : "Copy Code"}
                            </span>
                        </div>
                        {validTillDateTime && (
                            <div>
                                <p className="text-sm">Valid Till {validTillDateTime.split("T")[0]}</p>
                            </div>
                        )}
                    </div>

                    <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6" />
                    <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6" />
                </div>
            </div>
        </div>
    );
}
