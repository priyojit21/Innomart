import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Seller/Sidebar';
import Navbar from '../../components/Seller/Navbar';
import { useParams } from "react-router-dom";
import axiosInstance from '../../middleware/axiosInterceptor';
import { Carousel } from 'antd';

const SingleProductPage = () => {
  const [productDetails, setProductDetails] = useState({});
  const [variations, setVariations] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);
  const params = useParams();
  const productId = params.id;
  const accessToken = localStorage.getItem("accessToken");

  const getSingleProduct = async () => {
    try {
      const res = await axiosInstance.get(`http://localhost:3000/product/getSingleProduct/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setProductDetails(res.data.data);
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
    const variation = productDetails.variation.find((variant) =>
      variant.details[key] === value
    );
    if (variation) {
      setSelectedVariation(variation);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, [productId]);

  useEffect(() => {
    if (productDetails.variation) {
      createObject();
      const firstVariation = productDetails.variation[0];
      if (firstVariation) {
        setSelectedVariation(firstVariation);
      }
    }
  }, [productDetails]);

  return (
    <div className="lg:flex items-start">
      <div className="flex-grow">
        <Sidebar />
      </div>
      <div className="lg:flex lg:flex-col lg:w-full">
        <Navbar pageName="Product Details" />
        <div className="h-[calc(100vh-100px)] bg-[#e3e0e0] p-[20px] xl:pt-[57px] xl:pl-[79px] overflow-scroll">
          <div className="bg-[#FFFFFF] max-w-[1118px] pt-[47px] pl-[22px] pr-[22px] rounded-[20px] flex flex-col lg:flex-row gap-[15px] lg:gap-[36px]">

            <div className="relative w-full lg:max-w-[470px] mb-[20px]">
              <Carousel autoplay={true}>
                {productDetails.productImages?.map((image, index) => (
                  <div key={index} className="h-[200px] lg:h-[301px] w-full rounded-[10px]">
                    <img
                      src={image}
                      alt={`Slide ${index}`}
                      className="w-full h-full object-contain rounded-[10px]"
                    />
                  </div>
                ))}
                {productDetails.productVideo && (
                  <div className="h-[200px] lg:h-[301px] w-full rounded-[10px]">
                    <video autoPlay loop muted className="w-full h-full object-cover rounded-[10px]">
                      <source src={productDetails.productVideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </Carousel>
            </div>

            <div className="lg:border-l-[1px] lg:border-[#EEEEEE] lg:pl-[36px] mb-[30px] text-center xl:text-left flex-1">
              <p className="font-man mb-[15px] lg:mb-[45px] font-medium text-[24px]">
                {productDetails.productName}
              </p>
              <p className="mb-[13px] lg:mb-[23px]">Description</p>
              <p className="mb-[13px] lg:mb-[39px]">{productDetails.description}</p>

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


              <div className="flex gap-[20px] justify-center lg:justify-between flex-wrap max-w-[510px]  border-[1px] border-[#EEEEEE] bg-[#FAFAFA] py-[21px] px-[23px] rounded-[7px] mb-[39px] mx-auto items-center">
                <div className="flex flex-col min-w-[120px] items-center">
                  <p>Base Pricing</p>
                  <p className="text-[#EC2F79] mt-[17px] min-h-[24px]">
                    ₹{selectedVariation ? selectedVariation.sellingPrice : 'N/A'}
                  </p>
                </div>
                <div className="flex flex-col min-w-[120px] items-center">
                  <p>Stock</p>
                  <p className="text-[#EC2F79] mt-[17px] min-h-[24px]">
                    {selectedVariation ? selectedVariation.stock : 'N/A'}
                  </p>
                </div>
                <div className="flex flex-col min-w-[120px] items-center">
                  <p>{selectedVariation?.discountType === "Percentage" ? 'Discount' : 'Flat'}</p>
                  <p className="text-[#EC2F79] mt-[17px] min-h-[24px]">
                    {selectedVariation
                      ? selectedVariation.discountType === "Percentage"
                        ? `${selectedVariation.discount}%`
                        : `₹${selectedVariation.discount}`
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between flex-wrap mb-[30px]">
                <div className="flex flex-col min-w-[100px] items-center xl:items-start">
                  <p>SKU ID</p>
                  <p className="mt-[17px] text-[#64676F] min-h-[24px]">
                    {selectedVariation ? selectedVariation.skuId : 'N/A'}
                  </p>
                </div>
                <div className="flex flex-col min-w-[100px] items-center xl:items-start">
                  <p>Weight</p>
                  <p className="mt-[17px] text-[#64676F] min-h-[24px]">
                    {productDetails.weight || 'N/A'}
                  </p>
                </div>
                <div className="flex flex-col min-w-[100px] items-center xl:items-start">
                  <p>Dimensions</p>
                  <p className="mt-[17px] text-[#64676F] min-h-[24px]">
                    {productDetails.dimensions || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mt-[43px] mb-[18px]">
                Tags
              </div>
              <div className="flex gap-[7px] mb-[51px] justify-center xl:justify-start flex-wrap">
                {productDetails.tags?.length > 0 ? (
                  productDetails.tags.map((tag, index) => (
                    <div key={index} className="px-[13px] py-[9px] bg-[#EFEFEF] rounded-[5px]">
                      {tag}
                    </div>
                  ))
                ) : (
                  <div className="text-[#999]">No tags</div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
