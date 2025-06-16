import React, { useState, useEffect } from "react";
import Sidebar from "../../components/user/Sidebar";
import Navbar from "../../components/user/Navbar";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Progress, Rate } from "antd";
import admin from "../../assets/seller/admin.svg";
import star from "../../assets/user/star.svg";
import circle from "../../assets/user/circle.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  handleCartItems,
  showWishlist,
} from "../../features/productDetailSlice";
import axiosInstance from "../../middleware/axiosInterceptor";
import { ProductCard } from "../../components/Helper/productCard";

const SingleProductPage = () => {
  const [productDetails, setProductDetails] = useState({});
  const [mainImage, setMainImage] = useState(0);
  const [video, setVideo] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [variations, setVariations] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [reviewDetails, setReviewDetails] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const params = useParams();
  const productId = params.id;
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.app.wishlistItems);

  useEffect(() => {
    dispatch(showWishlist());
  }, [dispatch]);

  useEffect(() => {
    const inWishlist = wishlistItems?.some(
      (item) =>
        item.productId === productId &&
        item.variationId === selectedVariation?._id
    );
    setIsInWishlist(inWishlist);
  }, [wishlistItems, productId, selectedVariation]);

  const getSingleProduct = async () => {
    try {
      const res = await axiosInstance.get(
        `http://localhost:3000/product/getSingleProduct/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProductDetails(res.data.data);
      setRelatedProducts(res.data.relatedProducts);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getReviews = async () => {
    try {
      const data = { productId };
      const res = await axiosInstance.post(
        `http://localhost:3000/product/getFeedback`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setReviewDetails(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const createObject = () => {
    const variationObject = {};
    productDetails.variation?.forEach((variation) => {
      Object.keys(variation.details).forEach((key) => {
        const lowerKey = key.toLowerCase();
        if (!variationObject[lowerKey]) {
          variationObject[lowerKey] = [];
        }
        if (!variationObject[lowerKey].includes(variation.details[key])) {
          variationObject[lowerKey].push(variation.details[key]);
        }
      });
    });
    setVariations(variationObject);
  };

  const handleOptionSelect = (key, value) => {
    const variation = productDetails.variation.find(
      (variant) => variant.details[key] === value
    );
    if (variation) {
      setSelectedVariation(variation);
    }
  };

  useEffect(() => {
    if (productDetails.variation) {
      createObject();
      const firstVariation = productDetails.variation[0];
      if (firstVariation) {
        setSelectedVariation(firstVariation);
      }
    }
  }, [productDetails]);

  useEffect(() => {
    getSingleProduct();
    getReviews();
  }, [productId]);

  const changeImage = (index) => {
    setMainImage(index);
    setVideo(false);
  };

  const addToWishlist = async () => {
    try {
      const data = {
        productId,
        variationId: selectedVariation._id,
      };
      await axiosInstance.post(`product/addWishlist`, data);
      dispatch(showWishlist());
      toast.success("Added to wishlist!");
      setIsInWishlist(true);
    } catch (error) {
      console.log(error);
    }
  };

  async function addToCart() {
    try {
      const data = {
        productId,
        variationId: selectedVariation._id,
      };

      const response = await axiosInstance.post("cart/addItems", data);
      dispatch(handleCartItems());

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("error occurred: ", error);
      toast.error(error.response.data.message);
    }
  }

  const removeFromWishlist = async () => {
    try {
      const variationId = selectedVariation._id;
      const response = await axiosInstance.delete(
        `product/removeWishlist/${productId}/${variationId}`
      );

      if (response.status) {
        toast.success(response.data.message);
        dispatch(showWishlist());
        setIsInWishlist(false);
      }
    } catch (error) {
      console.log("error occurred: ", error);
      toast.error(error);
    }
  };

  const calculateRatingsCount = (reviews) => {
    const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews?.forEach((review) => {
      const rating = parseInt(review.rating, 10);
      if (ratingsCount[rating] !== undefined) {
        ratingsCount[rating]++;
      }
    });
    return ratingsCount;
  };

  const ratingsCount = reviewDetails
    ? calculateRatingsCount(reviewDetails.data)
    : {};

  return (
    <>
      <div className="lg:flex items-start">
        <div className="flex-grow">
          <Sidebar />
        </div>
        <div className="lg:flex lg:flex-col lg:w-full">
          <Navbar pageName="Product Details" />
          <div className="h-[calc(100vh-85px)] bg-[#e3e0e0] p-[20px] xl:pt-[31px] xl:pl-[20px] overflow-scroll">
            <div className="bg-[#FFFFFF] max-w-[1630px] px-[10px] pt-[15px] lg:px-[22px] rounded-[20px] font-man text-[#707070] font-medium pb-[52px]">
              <div className="flex gap-[39px] flex-col lg:flex-row mb-[40px] lg:mb-[80px]">
                <div>
                  <h1 className="mb-[10px]">Main Image</h1>
                  {!video ? (
                    <img
                      src={productDetails.productImages?.[mainImage]}
                      alt={productDetails.productName}
                      className="w-full h-[301px] lg:w-[470px] lg:h-[301px] rounded-[10px] mb-[33px] object-contain"
                    />
                  ) : (
                    <video
                      className="w-[250px] lg:w-[470px] lg:h-[301px] rounded-[10px] mb-[33px]"
                      loop
                      autoPlay
                      muted
                    >
                      <source src={productDetails.productVideo} />
                    </video>
                  )}
                  <h2 className="font-man text-[#707070] font-medium mb-[10px]">
                    All Images
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:w-[470px] mb-[20px] gap-[10px] object-contain">
                    {productDetails.productImages?.map((image, index) => (
                      <div
                        key={index}
                        className="max-w-[250px] lg:w-[150px]  bg-[#EDF2FC] border border-dashed border-[#BDCEF1] rounded-[10px] overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Product image ${index + 1}`}
                          className="w-[250px] h-[146px] lg:w-[150px] lg:h-[107px] object-contain"
                          onMouseOver={() => changeImage(index)}
                        />
                      </div>
                    ))}
                  </div>
                  {productDetails.productVideo && (
                    <div>
                      <h2 className="font-man text-[#707070] font-medium">
                        Video
                      </h2>
                      <div className="max-w-[250px] lg:w-[150px] mt-[10px] rounded-[10px] overflow-hidden md:mx-[10px]">
                        <video
                          className="w-[250px] h-[146px] lg:w-[150px] lg:h-[107px]"
                          onMouseOver={() => setVideo(true)}
                        >
                          <source src={productDetails.productVideo} />
                        </video>
                      </div>
                    </div>
                  )}

                  <div className="mt-[10px]">
                    <div className="flex justify-center lg:w-[470px] gap-[13px]">
                      {isInWishlist ? (
                        <div
                          className="w-[190px] lg:px-[20px] py-4 bg-[#F1F1F1] rounded-[10px] text-[#0C0C0C] text-center cursor-pointer"
                          onClick={removeFromWishlist}
                        >
                          Remove Wishlist
                        </div>
                      ) : (
                        <div
                          className="w-[161px] lg:px-[20px] py-4 bg-[#d0cdcd] rounded-[10px] text-[#0C0C0C] text-center cursor-pointer"
                          onClick={addToWishlist}
                        >
                          Add Wishlist
                        </div>
                      )}
                      {selectedVariation?.stock !== 0 ? (
                        <div
                          className="w-[161px] lg:px-[20px] py-4  bg-[#EC2F79] text-[#FFFFFF] rounded-[10px] text-center cursor-pointer"
                          onClick={addToCart}
                        >
                          Add to Cart
                        </div>
                      ) : (
                        <div className="w-[161px] lg:px-[20px] py-4 bg-[#928d8f] text-[#FFFFFF] rounded-[10px] text-center cursor-not-allowed">
                          Out of Stock
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="lg:border-l-[1px] lg:border-[#aba9a9ae] lg:pl-[36px] mt-[38px]">
                  <p className="font-man mb-[15px] lg:mb-[45px] font-medium text-[24px] lg:text-[24px]">
                    {productDetails.productName}
                  </p>
                  <p className="mb-[13px] lg:mb-[23px]">Description</p>
                  <p className="mb-[13px] lg:mb-[39px]">
                    {productDetails.description}
                  </p>

                  <div className="grid gap-[15px] xl:grid-cols-2 3xl:grid-cols-3 mb-[46px]">
                    {Object.keys(variations).map((key) => (
                      <div key={key}>
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                        <div className="flex mt-[17px] justify-center xl:justify-start flex-wrap">
                          {variations[key].map((option, idx) => {
                            const isSelected = selectedVariation?.details[key] === option;
                            const isColor = key.toLowerCase() === 'color';

                            return (
                              <div
                                key={idx}
                                className={`mr-[6px] mb-[6px] cursor-pointer rounded ${isColor
                                  ? `w-[32px] h-[32px] border-2 ${isSelected ? 'border-[#EC2F79]' : 'border-[#D1D5DB]'}`
                                  : `px-[11px] py-[6px] ${isSelected ? 'bg-[#EC2F79] text-white' : 'bg-[#EDF2FC] text-[#64676F]'}`
                                  } flex items-center justify-center`}
                                onClick={() => handleOptionSelect(key, option)}
                                style={isColor ? { backgroundColor: option } : {}}
                              >
                                {!isColor && option}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-[26px] justify-between flex-wrap max-w-[510px] lg:gap-[25px] border-[1px] border-[#EEEEEE] bg-[#FAFAFA] py-[21px] px-[23px] rounded-[7px] mb-[39px]">
                    <div className="flex flex-col gap-[26px]">
                      <div className="flex gap-[20px]">
                        <p>Base Pricing:</p>
                        <p className="text-[#EC2F79] min-w-[80px]">
                          ₹
                          {selectedVariation
                            ? selectedVariation.sellingPrice
                            : "00000"}
                        </p>
                      </div>
                      <div className="flex gap-[20px]">
                        <p>Stock:</p>
                        <p className="text-[#EC2F79] min-w-[80px]">
                          {selectedVariation ? selectedVariation.stock : "000"}
                        </p>
                      </div>
                      <div className="flex gap-[20px]">
                        <p>Discount:</p>
                        <p className="text-[#EC2F79] min-w-[80px]">
                          {selectedVariation
                            ? `${selectedVariation.discount}%`
                            : "00%"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-[26px]">
                      <div className="flex gap-[20px]">
                        <p>SKU ID:</p>
                        <p className="text-[#EC2F79] min-w-[80px]">
                          {selectedVariation
                            ? selectedVariation.skuId
                            : "000000"}
                        </p>
                      </div>
                      <div className="flex gap-[20px]">
                        <p>Weight:</p>
                        <p className="text-[#EC2F79] min-w-[80px]">
                          {productDetails.weight
                            ? productDetails.weight
                            : "0.00kg"}
                        </p>
                      </div>
                      <div className="flex gap-[20px]">
                        <p>Dimensions:</p>
                        <p className="text-[#EC2F79] min-w-[80px]">
                          {productDetails.dimensions
                            ? productDetails.dimensions
                            : "0x0x0"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mb-[39px]">Shipping Information:</p>
                  <p className="text-[#0C0C0C] font-bold">
                    <span className="text-[#707070] font-semibold pr-[14px]">
                      Shipping:
                    </span>
                    Free International Shipping
                  </p>
                </div>
              </div>
              <div className="flex flex-col xl:flex-row gap-[20px] lg:gap-[112px] ">
                {reviewDetails?.data && reviewDetails.data.length > 0 ? (
                  <div className="text-[#0C0C0C]">
                    Review & Rating:
                    <div className="flex justify-between flex-col lg:flex-row gap-[20px] lg:gap-[67px] items-center mb-7">
                      <div className="flex flex-col items-center">
                        <div className="text-[60px]">
                          {reviewDetails?.averageRating}
                        </div>
                        <Rate
                          disabled
                          allowHalf
                          value={reviewDetails?.averageRating}
                        />
                        <p className="text-[#64676F] mt-[21px]">
                          &#40; {reviewDetails?.totalReview} Reviews &#41;
                        </p>
                      </div>

                      <div className="flex ">
                        <div className="flex flex-col items-center rating-wrapper">
                          <Rate disabled defaultValue={4} />
                        </div>

                        <div className="flex">
                          <div className="flex flex-col items-center w-48 gap-[4px]">
                            {[5, 4, 3, 2, 1].map((rating) => {
                              const count = ratingsCount[rating] || 0;
                              const percentage = reviewDetails?.totalReview
                                ? (count / reviewDetails.totalRating) * 100
                                : 0;
                              return (
                                <div className="flex w-full gap-2">
                                  <span>{rating}</span>
                                  <Progress
                                    percent={percentage}
                                    showInfo={false}
                                    strokeColor={"#2A977D"}
                                  />
                                  <span>{count}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:mt-[82px] max-w-[470px] bg-[#FAFAFA] p-[22px] border-[1px] rounded-[10px]">
                      <p className="mb-[18px]">Return / Refund Policy:</p>
                      <p>
                        A refund will be provided after we process your return
                        item at our Innomart or third-party seller facilities.
                        It can take up to 30 days for us to receive and process
                        your return. In certain circumstances refund time frames
                        may be longer.
                      </p>
                    </div>
                  </div>
                ) : (<></>)}
                <div>
                  {reviewDetails?.length > 0 && (
                    <>
                      <p className="mb-[51px]">Top Reviews:</p>
                      <div className="h-[300px] overflow-scroll max-w-[640px]">
                        {reviewDetails?.data
                          .sort((a, b) => b.rating - a.rating)
                          .map((data, index) => {
                            const date = new Date(data.dateTime);
                            const options = {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            };
                            const formattedDate = date.toLocaleDateString(
                              "en-US",
                              options
                            );
                            return (
                              data.review && (
                                <div
                                  key={index}
                                  className="border-b-[1px] border-[#E9E9E9] mb-[27px]"
                                >
                                  <div className="flex flex-col items-center lg:flex-row gap-[18px]">
                                    {data.userId.profilePic !== "" ? (
                                      <img
                                        src={data.userId.profilePic}
                                        className="w-[52px] h-[52px] rounded-full"
                                        alt="Profile"
                                      ></img>
                                    ) : (
                                      <img
                                        src={admin}
                                        className="w-[56px] h-[56px] rounded-full"
                                        alt="Admin"
                                      ></img>
                                    )}
                                    <div>
                                      {data.userId.firstName}{" "}
                                      {data.userId.lastName}
                                      <div className="flex justify-center gap-[4px]">
                                        <img src={star} alt="Star"></img>
                                        <p>{data.rating}</p>
                                      </div>
                                    </div>
                                    <img
                                      src={circle}
                                      className="lg:self-start pt-[10px]"
                                      alt="Circle"
                                    ></img>
                                    <div>
                                      <p>{formattedDate}</p>
                                    </div>
                                  </div>
                                  <div className="mb-[17px]">{data.review}</div>
                                </div>
                              )
                            );
                          })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {relatedProducts?.length > 0 && (
              <>
                <div className="mt-[32px] mb-[35px]">Related Products</div>
                <div className="flex flex-wrap gap-[17px] ">
                  {relatedProducts?.map((relatedProduct, index) => {
                    return (
                      <ProductCard
                        key={index}
                        productName={relatedProduct?.productName}
                        productPrice={relatedProduct?.variation[0]?.sellingPrice}
                        productImage={relatedProduct?.productImages[0]}
                        productId={relatedProduct?._id}
                        variationId={relatedProduct?.variation[0]?._id}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default SingleProductPage;
