import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showWishlist } from "../../features/productDetailSlice";
import { Toaster } from "react-hot-toast";
import Sidebar from "../../components/user/Sidebar";
import Navbar from "../../components/user/Navbar";
import Searchbox from "../../components/Helper/Searchbox";
import { ProductCard } from "../../components/Helper/productCard";

const Wishlist = () => {
    const dispatch = useDispatch();
    const { wishlistItems, loading } = useSelector((state) => state.app);

    useEffect(() => {
        dispatch(showWishlist());
    }, [dispatch]);

    return (
        <>
            <div className="lg:flex items-start">
                {/* Sidebar */}
                <div className="flex-grow">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <div className="lg:flex lg:flex-col lg:w-full">
                    <Navbar pageName="Wishlist" />

                    <div className="h-[calc(100vh-80px)] bg-[#e3e0e0] p-[20px] overflow-scroll">
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between w-full gap-2 pb-[20px]">
                                <Searchbox />
                            </div>

                            {/* Wishlist Display */}
                            <div className="gap-[17px] flex flex-wrap justify-center lg:justify-start">
                                {loading ? (
                                    <p className="text-center w-full">Loading wishlist...</p>
                                ) : wishlistItems?.length > 0 ? (
                                    wishlistItems.map((element, index) => (
                                        <ProductCard
                                            key={index}
                                            productName={element.productName}
                                            productPrice={element.sellingPrice}
                                            productImage={element.productImages?.[0] || ""}
                                            productId={element.productId}
                                            variationId={element.variationId}
                                        />
                                    ))
                                ) : (
                                    <p className="text-center w-full text-gray-500">
                                        No items in wishlist
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Toaster />
        </>
    );
};

export default Wishlist;
