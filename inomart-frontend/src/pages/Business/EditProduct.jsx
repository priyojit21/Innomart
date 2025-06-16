import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Seller/Sidebar";
import Navbar from "../../components/Seller/Navbar";
import upload from "../../assets/seller/upload.svg";
import { FileUploader } from "react-drag-drop-files";
import { Select, Switch } from "antd";
import axiosInstance from "../../middleware/axiosInterceptor";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ProductDetails } from "../../components/Seller/PrdouctDetails";
import toast, { Toaster } from "react-hot-toast";
import { FiChevronDown } from "react-icons/fi";
import { yupResolver } from "@hookform/resolvers/yup";
import { productValidation } from "../../validators/productValidation";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [previousImages, setPreviousImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [categories, setCategories] = useState({});
  const [categoryOptions, setCategoryOption] = useState([]);
  const [regularPrice, setRegularPrice] = useState([]);
  const [discount, setDiscount] = useState([]);
  const [discountType, setDiscountType] = useState([]);
  const [calculatedSellingPrice, setCalculatedSellingPrice] = useState([]);
  const [showPercentage, setShowPercentage] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState,
    reset,
  } = useForm({
    resolver: yupResolver(productValidation),
    defaultValues: {
      isEnabled: true,
      tags: [],
      category: [],
      variations: [
        {
          regularPrice: 0,
          sellingPrice: 0,
          discountType: "",
          discount: 0,
          stock: 0,
          lowStockAlert: "",
          outOfStockStatus: "",
          skuId: "",
          details: [{ key: "", value: "" }],
        },
      ],
    },
  });
  const params = useParams();
  const productId = params.productId;

  const getSingleProduct = async () => {
    try {
      const res = await axiosInstance.get(`product/getSingleProduct/${productId}`);
      if (res && res.data) {
        const productData = res.data.data;
        let numericWeight, unit;
        if (productData.weight) {
          const weight = productData.weight;
          numericWeight = weight.replace(/\D/g, "");
          unit = weight.replace(/\d/g, "");
        }

        setPreviousImages(productData.productImages || []);
        setVideoUrl(productData.productVideo || null);

        const defaultValues = {
          productName: productData.productName,
          description: productData.description,
          category: productData.category,
          brandName: productData.brandName,
          variations: productData?.variation?.map((variation) => ({
            ...variation,
            details: variation.details
              ? Object.entries(variation.details).map(([key, value]) => ({
                key,
                value,
              }))
              : [],
          })),
          weight: numericWeight,
          weightUnit: unit,
          dimensions: productData.dimensions,
          shippingMethods: productData.shippingMethods,
          deliveryTime: productData.deliveryTime,
          freeShipping: JSON.stringify(productData.freeShipping),
          tags: productData.tags,
          isEnabled: JSON.stringify(productData.isEnabled),
        };
        reset(defaultValues);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  const handleImageChange = async (file) => {
    if (!file) return;
    setFiles([file]);

    const formData = new FormData();
    formData.append("uploadedFile", file);
    try {
      const imgResponse = await axiosInstance.post(
        `product/uploadProductImages/${productId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(imgResponse)
      if (imgResponse.data.success) {
        if (imgResponse.data.productImages) {
          setPreviousImages(
            imgResponse.data.productImages,
          );
        }
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data.message || "Failed to upload images."
      );
      console.error("Error uploading images:", error);
    }
  };

  const handleVideoChange = (file) => {
    setVideoFile(file);
  };

  const getAllCategories = async () => {
    try {
      const response = await axiosInstance.get("category/get");
      const categoryMap = {};
      const transformedCategories = response.data.data.map((category) => {
        categoryMap[category.name] = category._id;
        return {
          label: category.name,
          value: category._id,
        };
      });
      setCategories(categoryMap);
      setCategoryOption(transformedCategories);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getAllCategories();
    getSingleProduct();
  }, []);

  const handleRegularPriceChange = (e, index) => {
    const value = parseInt(e.target.value) || 0;
    const updatedRegularPrices = [...regularPrice];
    updatedRegularPrices[index] = value;
    setRegularPrice(updatedRegularPrices);
    updateSellingPrice(index, value, discount[index], discountType[index]);
  };
  const handleDiscountChange = (e, index) => {
    const value = parseInt(e.target.value) || 0;
    const updatedDiscounts = [...discount];
    updatedDiscounts[index] = value;
    setDiscount(updatedDiscounts);
    updateSellingPrice(index, regularPrice[index], value, discountType[index]);
  };
  const handleDiscountTypeChange = (type, index) => {
    type === "Percentage" ? setShowPercentage(true) : setShowPercentage(false);
    const updatedTypes = [...discountType];
    updatedTypes[index] = type;
    setDiscountType(updatedTypes);
    updateSellingPrice(index, regularPrice[index], discount[index], type);
  };
  const updateSellingPrice = (index, regPrice, disc, discType) => {
    let newPrice = regPrice;
    if (discType === "Percentage") {
      newPrice = regPrice - (regPrice * disc) / 100;
    } else if (discType === "Fixed") {
      newPrice = regPrice - disc;
    }

    const updatedPrices = [...calculatedSellingPrice];
    updatedPrices[index] = newPrice > 0 ? newPrice : 0;
    setCalculatedSellingPrice(updatedPrices);
    setValue(`variations[${index}].sellingPrice`, newPrice);
  };

  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

  const handleDeleteImage = async (imageUrl) => {
    try {
      await axiosInstance.delete(`product/deleteProductImage/${productId}`, {
        data: { imageUrl },
      });
      setPreviousImages((prev) => prev.filter((img) => img !== imageUrl));
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
      console.error("Error deleting image:", error);
    }
  };

  const handleDeleteVideo = async () => {
    if (!videoUrl) return;
    try {
      await axiosInstance.delete(`product/deleteProductVideo/${productId}`, {
        data: { videoUrl },
      });
      setVideoUrl(null);
      setVideoFile(null);
      toast.success("Video deleted successfully");
    } catch (error) {
      toast.error("Failed to delete video");
      console.error("Error deleting video:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const knownCategoryIds = [];
      const newCategoryNames = [];
      data.category.forEach((cat) => {
        if (isValidObjectId(cat)) {
          knownCategoryIds.push(cat);
        } else {
          newCategoryNames.push(cat);
        }
      });

      const newCategoryIds = [];
      for (const name of newCategoryNames) {
        const existingCategory = Object.entries(categories).find(
          ([catName]) => catName.toLowerCase() === name.toLowerCase()
        );
        if (existingCategory) {
          newCategoryIds.push(existingCategory[1]);
        } else {
          const res = await axiosInstance.post("/category/add", { name });
          newCategoryIds.push(res.data.data._id);
        }
      }

      const finalCategoryIds = [...knownCategoryIds, ...newCategoryIds];
      const payload = {
        ...data,
        weight: `${data.weight}${data.weightUnit}`,
        category: finalCategoryIds,
        tags: data.tags,
        variations: data.variations.map((item) => {
          const variation =
            typeof item === "string" ? JSON.parse(item) : { ...item };

          if (Array.isArray(variation.details)) {
            const detailsObj = {};
            variation.details.forEach(({ key, value }) => {
              if (key) {
                detailsObj[key.toLowerCase().trim()] = value
                  ? value.toLowerCase()
                  : value;
              }
            });
            variation.details = detailsObj;
          }
          if (
            typeof variation.details === "object" &&
            !Array.isArray(variation.details)
          ) {
            variation.details = JSON.stringify(variation.details);
          }

          variation.regularPrice = Number(variation.regularPrice);
          variation.sellingPrice = Number(variation.sellingPrice);
          variation.discount = Number(variation.discount ?? 0);

          return JSON.stringify(variation);
        }),
      };

      delete payload.weightUnit;

      const response = await axiosInstance.put(
        `product/editProduct/${productId}`,
        payload
      );

      if (response.data.success) {
        toast.success("Product updated successfully");
        reset();
        navigate("/product/seller");
        if (videoFile) {
          const videoFormData = new FormData();
          videoFormData.append("productVideo", videoFile);
          try {
            const videoRes = await axiosInstance.post(
              `product/videoProduct/${productId}`,
              videoFormData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            if (
              videoRes.data.success &&
              videoRes.data.data &&
              videoRes.data.data.videoUrl
            ) {
              setVideoUrl(videoRes.data.data.videoUrl);
              setVideoFile(null);
              toast.success("Video uploaded successfully");
            }
          } catch (err) {
            toast.error(err.response?.data.message || "Failed to upload video.");
            console.error("Error uploading video:", err);
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data.message || "Failed to update product.");
      console.error("Error submitting product:", error);
    }
  };

  return (
    <>
      <div className="lg:flex items-start">
        <div className="flex-grow">
          <Sidebar />
        </div>
        <div className="lg:flex lg:flex-col lg:w-full">
          <Navbar pageName="Edit Product" />
          <div className="h-[calc(100vh-100px)] bg-[#e3e0e0] p-[20px] overflow-scroll">
            <div className="lg:w-[700px] xl:w-[1111px] lg:pt-[11px] bg-white rounded-[10px] xl:[w-900] flex flex-col xl:flex-row">
              <div>
                <p className="pt-[20px] mx-[10px] lg:w-[470px] bg-white border-b border-[#EEEEEE] pb-[10px]">
                  Media Management (Add Images & Video)
                </p>

                {/* Images Section */}
                <div className="lg:h-[300px] border-b border-[#EEEEEE] m-[10px]">
                  <p className="font-semibold text-gray-700 text-lg mx-2 mt-2">Images</p>
                  <div className="mt-[9px] grid grid-cols-1 md:grid-cols-3 gap-[10px] lg:w-[470px] pb-[10px]">
                    {/* Image uploader */}
                    <div className="w-[250px] lg:max-w-[150px] bg-[#EDF2FC] border border-dashed border-[#BDCEF1] lg:pt-[24px] lg:pb-[17px] py-[40px] mt-[10px] rounded-[10px] flex flex-col items-center mx-auto md:mx-[10px] overflow-hidden">
                      <FileUploader
                        handleChange={handleImageChange}
                        name="file"
                        types={["JPG", "JPEG", "PNG"]}
                        multiple={false}
                      >
                        <img src={upload} className="mb-[9px] mx-auto" alt="Upload Icon" />
                        <p className="font-man text-[12px] w-[100px] text-center">
                          Drag & Drop image file here
                        </p>
                      </FileUploader>
                    </div>


                    {[...previousImages].map((item, index) => (
                      <div
                        key={index}
                        className="max-w-[250px] lg:w-[150px] bg-[#EDF2FC] border border-dashed border-[#BDCEF1] mt-[10px] rounded-[10px] overflow-hidden mx-auto md:mx-[10px] relative"
                      >
                        {console.log(item)}
                        <img
                          src={item}
                          alt={`Image ${index}`}
                          className="w-[250px] h-[146px] lg:w-[150px] lg:h-[107px]"
                        />
                        <button
                          onClick={() =>
                            typeof item === 'string'
                              ? handleDeleteImage(item)
                              : setFiles((prev) => prev.filter((_, i) => i !== index - previousImages.length))
                          }
                          className="absolute top-2 right-2 text-red-600 text-xl font-bold"
                          aria-label="Delete image"
                          type="button"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video Section */}
                <p className="font-semibold text-gray-700 text-lg mx-2 mt-[20px]">Video</p>
                <div className="flex gap-[10px] items-center flex-wrap mr-[5px]">
                  {/* Video uploader */}
                  <div className="w-[250px] lg:max-w-[150px] bg-[#EDF2FC] border border-dashed border-[#BDCEF1] lg:pt-[24px] lg:pb-[17px] py-[40px] mt-[20px] rounded-[10px] flex flex-col items-center mx-auto md:mx-[10px] overflow-hidden">
                    <FileUploader
                      handleChange={handleVideoChange}
                      name="video"
                      types={["MP4", "WebM", "MKV"]}
                      multiple={false}
                    >
                      <img src={upload} className="mb-[9px] mx-auto" alt="Upload Icon" />
                      <p className="font-man text-[12px] w-[100px] text-center">
                        Drag & Drop video file here
                      </p>
                    </FileUploader>
                  </div>


                  {/* Video Preview */}
                  {videoUrl && (
                    <div className="max-w-[250px] lg:w-[150px] bg-[#EDF2FC] border border-dashed border-[#BDCEF1] mt-[10px] rounded-[10px] overflow-hidden mx-auto md:mx-[10px] relative">
                      <video
                        controls
                        className="w-[250px] h-[146px] lg:w-[150px] lg:h-[107px]"
                      >
                        <source src={videoUrl} type="video/mp4" />
                      </video>
                      <button
                        onClick={handleDeleteVideo}
                        className="absolute top-2 right-2 text-red-600 text-xl font-bold"
                        aria-label="Delete video"
                        type="button"
                      >
                        &times;
                      </button>
                    </div>
                  )}

                  {/* New video preview before upload */}
                  {videoFile && (
                    <div className="max-w-[250px] lg:w-[150px] bg-[#EDF2FC] border border-dashed border-[#BDCEF1] mt-[10px] rounded-[10px] overflow-hidden mx-auto md:mx-[10px] relative">
                      <video
                        controls
                        className="w-[250px] h-[146px] lg:w-[150px] lg:h-[107px]"
                        src={URL.createObjectURL(videoFile)}
                      />
                      <button
                        onClick={() => setVideoFile(null)}
                        className="absolute top-2 right-2 text-red-600 text-xl font-bold"
                        aria-label="Delete new video"
                        type="button"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
              </div>


              {/* Basic Details */}
              <div className="m-[10px] lg:m-[0px]">
                <p className="pt-[20px] xl:ml-[78px] lg:bg-white lg:border-b lg:border-[#EEEEEE] ml-[10px]">
                  Basic Details
                </p>
                <form
                  className="ml-[10px] xl:mx-[39px] lg:w-[524px]  xl:bg-white xl:border-l xl:border-[#EEEEEE] xl:pl-[39px]"
                >
                  <label className="text-gray-600 text-sm mt-[19px] mb-[13px] block">
                    Product Name
                  </label>
                  <input
                    {...register("productName")}
                    type="text"
                    className="w-full text-gray-800 text-sm px-4 py-3 mb-[5px] rounded border border-gray-300 shadow-md"
                    placeholder="Enter product name here"
                  />
                  <p className="text-xs text-red-600 font-semibold h-[10px] mb-[5px]">
                    {formState.errors.productName?.message}
                  </p>

                  <label className="text-gray-600 text-sm mb-[13px] block">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    className="w-full text-gray-800 text-sm px-4 py-3 rounded border mb-[5px] border-gray-300 shadow-md resize-none"
                    rows="6"
                  />
                  <p className="text-xs text-red-600 font-semibold h-[10px] mt-[-5px] mb-[5px]">
                    {formState.errors.description?.message}
                  </p>

                  <label className="text-gray-600 text-sm mb-[13px] block">
                    Category
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        mode="tags"
                        style={{ width: "100%" }}
                        onChange={(values) => field.onChange(values)}
                        tokenSeparators={[","]}
                        options={categoryOptions}
                        placeholder="Enter category here"
                        value={field.value}
                        suffixIcon={
                          <FiChevronDown
                            style={{ fontSize: "22px", position: "relative", top: "-10px" }}
                          />
                        }
                      />
                    )}
                  />
                  <p className="text-xs text-red-600 font-semibold h-[10px] mt-[-17px] mb-[5px]">
                    {formState.errors.category?.message}
                  </p>

                  <label className="text-gray-600 text-sm mb-[13px] block">
                    Brand Name
                  </label>
                  <input
                    {...register("brandName")}
                    type="text"
                    className="w-full text-gray-800 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md mb-[5px]"
                    placeholder="Enter brand name here"
                  />
                  <p className="text-xs text-red-600 font-semibold h-[10px] mb-[5px]">
                    {formState.errors.brandName?.message}
                  </p>

                  <ul>
                    {fields.map((item, index) => (
                      <li key={item.id}>
                        <p className="pt-[50px] lg:w-[524px] mb-[19px] bg-white border-b border-[#EEEEEE]">
                          Pricing & Discounts
                        </p>

                        <div className="flex md:space-x-4 flex-col md:flex-row">
                          <div className="flex-1">
                            <label className=" w-full text-gray-600 text-sm mb-2 block">
                              Regular Price
                            </label>
                            <input
                              type="number"
                              {...register(`variations[${index}].regularPrice`, {
                                onChange: (e) => handleRegularPriceChange(e, index),
                              })}
                              className="w-full text-gray-800 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md mb-[5px]"
                              placeholder="Enter regular price"
                            />
                            <p className="text-xs text-red-600 font-semibold h-[10px] mb-[5px]">
                              {
                                formState.errors.variations?.[index]
                                  ?.regularPrice?.message
                              }
                            </p>
                          </div>

                          <div className="flex-1">
                            <label className="w-full text-gray-600 text-sm mb-2 block">
                              Seller Price
                            </label>
                            <input
                              type="number"
                              name="sellingPrice"
                              disabled
                              {...register(`variations[${index}].sellingPrice`)}
                              className="w-full text-gray-800 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md mb-[5px]"
                              placeholder="Enter seller price"
                            />
                            <p className="text-xs text-red-600 font-semibold h-[10px] mb-[5px]">
                              {
                                formState.errors.variations?.[index]
                                  ?.sellingPrice?.message
                              }
                            </p>
                          </div>
                        </div>

                        <label className="text-gray-600 text-sm mb-[13px] block">
                          Discount Management
                        </label>
                        <div className="flex items-center space-x-4 mb-[5px]">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              value="Percentage"
                              {...register(`variations[${index}].discountType`)}
                              onChange={() => handleDiscountTypeChange("Percentage", index)}
                              className="mr-2"
                            />
                            <label className="text-gray-800 text-sm">Percentage</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              value="Fixed"
                              {...register(`variations[${index}].discountType`)}
                              onChange={() => handleDiscountTypeChange("Fixed", index)}
                              className="mr-2"
                            />
                            <label className="text-gray-800 text-sm">
                              Fixed
                            </label>
                          </div>
                        </div>
                        <p className="text-xs text-red-600 font-semibold h-[10px] mb-[15px]">
                          {
                            formState.errors.variations?.[index]?.discountType
                              ?.message
                          }
                        </p>
                        <div className="relative mb-[50px]">
                          <input
                            {...register(`variations[${index}].discount`, {
                              onChange: (e) => handleDiscountChange(e, index),
                            })}
                            type="number"
                            className="w-full text-gray-800 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md pr-12 mb-[5px]"
                            placeholder="Enter Discount Percentage"
                          />
                          {showPercentage && (
                            <span className="absolute right-3 top-[21%] text-gray-600 text-sm">%</span>
                          )}
                          <p className="text-xs text-red-600 font-semibold h-[10px] mb-[15px]">
                            {
                              formState.errors.variations?.[index]?.discount
                                ?.message
                            }
                          </p>
                        </div>

                        <p className="lg:w-[524px] bg-white  mb-[19px] border-b border-[#EEEEEE]">
                          Stock & Inventory
                        </p>
                        <div className="flex space-x-4 mb-4">
                          <div className="flex-1">
                            <label className="text-gray-600 text-sm mb-2 block">
                              Stock Quantity
                            </label>
                            <input
                              type="number"
                              {...register(`variations[${index}].stock`)}
                              className="w-full text-gray-800 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md mb-[5px]"
                              placeholder="Enter stock quantity"
                            />
                            <p className="text-xs text-red-600 font-semibold h-[10px] mb-[15px]">
                              {
                                formState.errors.variations?.[index]?.stock
                                  ?.message
                              }
                            </p>
                          </div>
                          <div className="flex-1">
                            <label className="text-gray-600 text-sm mb-2 block">SKU ID</label>
                            <input
                              {...register(`variations[${index}].skuId`)}
                              type="text"
                              className="w-full text-gray-800 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md mb-[5px]"
                              placeholder="Enter SKU ID"
                            />
                            <p className="text-xs text-red-600 font-semibold h-[10px] mb-[15px]">
                              {
                                formState.errors.variations?.[index]?.skuId
                                  ?.message
                              }
                            </p>
                          </div>
                        </div>

                        <ProductDetails
                          variation={`variations[${index}]`}
                          register={register}
                          control={control}
                          errors={formState.errors.variations?.[index]}
                        />

                        <div className="flex justify-center">
                          <button
                            type="button"
                            className="bg-rose-600 text-white px-6 py-2 rounded-3xl"
                            onClick={() => remove(index)}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="bg-[#EC2F79] text-white px-6 py-2 rounded-[20px] flex justify-center mb-[30px] mt-[30px]"
                      onClick={() => append({ details: [{ key: "", value: "" }] })}
                    >
                      Add new variation
                    </button>
                  </div>

                  <p className="lg:w-[524px] bg-white  mb-[19px] border-b border-[#EEEEEE]">
                    Shipping Details
                  </p>
                  <div className="flex space-x-4 mb-4">
                    <div className="flex-1 relative">
                      <label className="text-gray-600 text-sm mb-2 block">Weight</label>
                      <div className="flex items-center">
                        <input
                          {...register("weight")}
                          type="number"
                          className="w-full text-gray-800 text-sm px-4 py-3 rounded-l transition-all border border-gray-300 shadow-md mb-[5px]"
                          placeholder="0"
                          min="0"
                        />
                        <select
                          {...register("weightUnit")}
                          className="absolute right-3 top-10 text-gray-600 text-sm outline-none"
                        >
                          <option value="kg">kg</option>
                          <option value="gm">gm</option>
                        </select>
                      </div>
                      <p className="text-xs text-red-600 font-semibold h-[10px] mb-[5px]">
                        {formState.errors.weight?.message}
                      </p>
                    </div>
                    <div className="flex-1">
                      <label className="text-gray-600 text-sm mb-2 block">Dimensions</label>
                      <input
                        type="text"
                        {...register("dimensions")}
                        className="w-full text-gray-800 text-sm px-4 py-3 rounded-l transition-all border border-gray-300 shadow-md mb-[5px]"
                        placeholder="5cmx3cmx2cm (lxbxh)"
                      />
                      <p className="text-xs text-red-600 font-semibold h-[10px] mb-[5px]">
                        {formState.errors.dimensions?.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4 mb-4">
                    <div className="flex-1">
                      <label className="text-gray-600 text-sm mb-2 block">
                        Available Shipping Methods
                      </label>
                      <select
                        {...register("shippingMethods")}
                        className="w-full text-gray-400 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md mb-[5px]"
                      >
                        <option value="" disabled selected>
                          Select shipping method
                        </option>
                        <option value="standard">Standard Shipping</option>
                        <option value="express">Express Shipping</option>
                        <option value="overnight">Overnight Shipping</option>
                      </select>
                      <p className="text-xs text-red-600 font-semibold h-[10px] mb-[5px]">
                        {formState.errors.shippingMethods?.message}
                      </p>
                    </div>
                    <div className="flex-1">
                      <label className="text-gray-600 text-sm mb-2 block">
                        Estimated Delivery Time
                      </label>
                      <select
                        {...register("deliveryTime")}
                        className="w-full text-gray-400 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md mb-[5px]"
                      >
                        <option value="" disabled selected>
                          Choose one delivery slot
                        </option>
                        <option value="1-3_days">1-3 Days</option>
                        <option value="3-5_days">3-5 Days</option>
                        <option value="5-7_days">5-7 Days</option>
                      </select>
                      <p className="text-xs text-red-600 font-semibold h-[10px] mb-[5px]">
                        {formState.errors.deliveryTime?.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      {...register("freeShipping")}
                      className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:bg-blue-600 checked:border-0 inline-block  checked:outline outline-blue-600 outline-offset-4 "
                    />
                    <label className="cursor-pointer ml-4">Free Shipping</label>
                  </div>

                  <p className="border-b-[1px] pb-1 mt-12 mb-7">Tags & Active Product</p>
                  <div>
                    <p className="text-[#52575C] mb-2">Tags</p>
                    <Controller
                      name="tags"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          mode="tags"
                          style={{ width: "100%" }}
                          tokenSeparators={[","]}
                          onChange={(values) => field.onChange(values)}
                          suffixIcon={
                            <FiChevronDown
                              style={{ fontSize: "22px", position: "relative", top: "-10px" }}
                            />
                          }
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center my-8">
                    <label className="mr-4 cursor-pointer text-[#52575C]">Product Active</label>
                    <Controller
                      name="isEnabled"
                      control={control}
                      render={({ field }) => (
                        <Switch {...field} checked={field.value} onChange={(checked) => field.onChange(checked)} />
                      )}
                    />
                  </div>

                  <div className="flex space-x-4 my-4">
                    <button
                      className="bg-gray-300 text-gray-800 text-sm px-[31px] py-2 rounded-[10px] transition duration-300 ease-in-out hover:bg-gray-400"
                      type="button"
                      onClick={() => navigate("/product/seller")}
                    >
                      Cancel
                    </button>

                    <button
                      className="bg-[#EC2F79] text-white text-sm px-[31px] py-2 rounded-[10px] transition duration-300 ease-in-out hover:bg-[#d6286b]"
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                    >
                      Publish
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default EditProduct;
