import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Seller/Sidebar";
import Navbar from "../../components/Seller/Navbar";
import upload from "../../assets/seller/upload.svg";
// import { FileUploader } from "react-drag-drop-files";
import { Select, Switch } from "antd";
import axiosInstance from "../../middleware/axiosInterceptor";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ProductDetails } from "../../components/Seller/PrdouctDetails";
import toast, { Toaster } from "react-hot-toast";
import { FiChevronDown } from "react-icons/fi";
import { yupResolver } from "@hookform/resolvers/yup";
import { productValidation } from "../../validators/productValidation";
import { draftValidation } from "../../validators/draftValidation";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoURL, setVideoURL] = useState("");
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
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(productValidation),
    defaultValues: {
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleChange = (fileList) => {
    setFiles((prevFiles) => [...prevFiles, ...fileList]);
  };

  const handleChangeVideo = (file) => {
    setVideo(file);
    const fileURL = URL.createObjectURL(file);
    setVideoURL(fileURL);
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

    if (discType === "Percentage" && disc > 0) {
      newPrice = regPrice - (regPrice * disc) / 100;
    } else if (discType === "Fixed" && disc > 0) {
      newPrice = regPrice - disc;
    }

    const updatedPrices = [...calculatedSellingPrice];
    updatedPrices[index] = newPrice > 0 ? newPrice : 0;
    setCalculatedSellingPrice(updatedPrices);
    setValue(`variations[${index}].sellingPrice`, newPrice);
  };

  const onSubmitProduct = async (data) => {
    try {
      const knownCategoryIds = [];
      const newCategoryNames = [];

      data.category.forEach((cat) => {
        const isMongoId = typeof cat === "string" && /^[a-f\d]{24}$/i.test(cat);
        if (isMongoId) {
          knownCategoryIds.push(cat);
        } else if (categories[cat]) {
          knownCategoryIds.push(categories[cat]);
        } else {
          newCategoryNames.push(cat);
        }
      });

      const newCategoryIds = [];
      for (const name of newCategoryNames) {
        const res = await axiosInstance.post("/category/add", { name });
        newCategoryIds.push(res.data.data._id);
        setCategories((prev) => ({ ...prev, [name]: res.data.data._id }));
      }

      const finalCategoryIds = [...knownCategoryIds, ...newCategoryIds];

      const formData = new FormData();
      for (const file of files) {
        formData.append("uploadedFile", file);
      }

      for (const key in data) {
        if (key === "weightUnit") continue;

        if (key === "weight") {
          formData.append("weight", data.weight + data.weightUnit);
        } else if (key === "category") {
          finalCategoryIds.forEach((id) => formData.append("category[]", id));
        } else if (key === "tags") {
          data.tags.forEach((tag) => formData.append("tags[]", tag));
        } else if (key === "variations") {
          data.variations.forEach((item) => {
            const variation = item;
            if (Array.isArray(variation.details)) {
              const detailsObj = {};
              variation.details.forEach(({ key, value }) => {
                if (key) {
                  detailsObj[key.trim().toLowerCase()] = value
                    ? value.trim().toLowerCase()
                    : value;
                }
              });
              variation.details = JSON.stringify(detailsObj);
            } else if (
              variation.details &&
              typeof variation.details === "object" &&
              !Array.isArray(variation.details)
            ) {
              variation.details = JSON.stringify(variation.details);
            }

            variation.regularPrice = Number(variation.regularPrice);
            variation.sellingPrice = Number(variation.sellingPrice);
            variation.discount = variation.discount ? Number(variation.discount) : 0;

            formData.append("variations[]", JSON.stringify(variation));
          });
        } else {
          formData.append(key, data[key]);
        }
      }

      const response = await axiosInstance.post("product/addProduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.data?.data?._id && video) {
        const formDataVideo = new FormData();
        formDataVideo.append("productVideo", video);
        await axiosInstance.post(`/product/videoProduct/${response.data.data._id}`, formDataVideo, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        toast.success("Product added successfully");
        reset();
        navigate("/product/seller");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error("Error submitting product:", error);
    }
  };

  const addToDraft = async (data) => {
    try {
      const knownCategoryIds = [];
      const newCategoryNames = [];

      if (Array.isArray(data.category) && data.category.length > 0) {
        data.category.forEach((cat) => {
          const isMongoId = typeof cat === "string" && /^[a-f\d]{24}$/i.test(cat);
          const isValid = cat && cat.trim().length > 0;

          if (!isValid) return;

          if (isMongoId) {
            knownCategoryIds.push(cat);
          } else if (categories[cat]) {
            knownCategoryIds.push(categories[cat]);
          } else {
            newCategoryNames.push(cat);
          }
        });
      }

      const newCategoryIds = [];

      for (const name of newCategoryNames) {
        try {
          if (name && name.trim()) {
            const res = await axiosInstance.post("/category/add", { name: name.trim() });
            const newId = res.data.data._id;
            newCategoryIds.push(newId);
            setCategories((prev) => ({ ...prev, [name.trim()]: newId }));
          }
        } catch (catErr) {
          console.error("Category creation error:", catErr);
        }
      }

      const finalCategoryIds = [...knownCategoryIds, ...newCategoryIds].filter(
        (id) => typeof id === "string" && id.trim().length === 24
      );
      const formData = new FormData();
      for (const file of files) {
        formData.append("uploadedFile", file);
      }
      for (const key in data) {
        if (key === "weightUnit") continue;

        if (key === "weight") {
          if (data.weight && data.weightUnit && /^\d+$/.test(data.weight)) {
            formData.append("weight", data.weight + data.weightUnit);
          }
        } else if (key === "category") {
          finalCategoryIds.forEach((id) => formData.append("category[]", id));
        } else if (key === "tags") {
          data.tags
            .filter((tag) => tag && tag.trim())
            .forEach((tag) => formData.append("tags[]", tag.trim()));
        } else if (key === "variations") {
          data.variations.forEach((item) => {
            const variation = item;
            let validDetails = false;
            if (Array.isArray(variation.details)) {
              for (const { key, value } of variation.details) {
                if (key && key.trim() !== "" && value && value.toString().trim() !== "") {
                  validDetails = true;
                  break;
                }
              }
            }
            const hasRequiredFields =
              variation.regularPrice != null &&
              variation.sellingPrice != null &&
              variation.stock != null &&
              typeof variation.skuId === "string" &&
              variation.skuId.trim() !== "";

            if (!hasRequiredFields || !validDetails) {
              console.warn("Skipping incomplete or empty-details variation:", variation);
              return;
            }

            const cleanedVariation = {};

            for (const vKey in variation) {
              const value = variation[vKey];
              const isEmpty =
                value === "" ||
                value === null ||
                value === undefined ||
                (typeof value === "number" && value === 0);

              if (!isEmpty) {
                cleanedVariation[vKey] = value;
              }
            }

            if (validDetails) {
              const detailsObj = {};
              variation.details.forEach(({ key, value }) => {
                if (key && key.trim()) {
                  detailsObj[key.trim().toLowerCase()] = value?.toString().trim() || value;
                }
              });

              if (Object.keys(detailsObj).length > 0) {
                cleanedVariation.details = JSON.stringify(detailsObj);
              }
            }

            formData.append("variations[]", JSON.stringify(cleanedVariation));
          });
        } else {
          if (data[key] != null && data[key] !== "") {
            formData.append(key, data[key]);
          }
        }
      }

      formData.append("isDraft", "true");

      const response = await axiosInstance.post("product/draftProduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.data?.data?._id && video) {
        const formDataVideo = new FormData();
        formDataVideo.append("productVideo", video);
        await axiosInstance.post(`/product/videoProduct/${response.data.data._id}`, formDataVideo, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        toast.success("Product drafted successfully");
        reset();
        navigate("/product/seller");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error("Error submitting product:", error);
    }
  };


  const handleSaveDraft = async () => {
    clearErrors();
    const draftData = getValues();

    try {
      await draftValidation.validate(draftData, { abortEarly: false });
      await addToDraft(draftData);
    } catch (validationErrors) {
      if (validationErrors.inner) {
        clearErrors();
        validationErrors.inner.forEach(({ path, message }) => {
          if (path) {
            setError(path, { type: "manual", message });
          }
        });
      } else {
        setError("formError", { type: "manual", message: validationErrors.message || "Draft validation failed" });
      }
    }
  };

  return (
    <>
      <div className="lg:flex items-start">
        <div className="flex-grow">
          <Sidebar />
        </div>
        <div className="lg:flex lg:flex-col lg:w-full">
          <Navbar pageName="Add New Product" />
          <div className="h-[calc(100vh-100px)] bg-[#e3e0e0] p-[20px] overflow-scroll">
            <div className="lg:w-[700px] xl:w-[1111px] lg:pt-[11px] bg-white rounded-[10px] xl:[w-900] flex flex-col xl:flex-row">
              {/* Media Management Section */}
              <div>
                <p className="pt-[20px] mx-[10px] lg:w-[470px] bg-white border-b border-[#EEEEEE] pb-[10px] ">
                  Media Management
                </p>
                <div className="lg:h-[300px] border-b border-[#EEEEEE]">
                  <div className="mt-[9px] grid grid-cols-1 md:grid-cols-3 gap-[10px] lg:w-[470px] pb-[10px]">
                    <div className="w-[250px] lg:max-w-[150px] bg-[#EDF2FC] border border-dashed border-[#BDCEF1] lg:pt-[24px] lg:pb-[17px] py-[40px] mt-[10px] rounded-[10px] flex flex-col items-center mx-auto md:mx-[10px] overflow-hidden ">
                      {/* <FileUploader
                        handleChange={handleChange}
                        name="file"
                        types={["JPG", "JPEG", "PNG"]}
                        multiple={true}
                      >
                        <img src={upload} className="mb-[9px] mx-auto" alt="Upload Icon" />
                        <p className="font-man text-[12px] w-[100px] text-center">Drag & Drop image files here</p>
                      </FileUploader> */}
                      <label
                        htmlFor="fileInput"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-all"
                      >
                        <img src={upload} className="mb-[9px] mx-auto" alt="Upload Icon" />
                        <p className="font-man text-[12px] w-[100px] text-center">Drag & Drop image files here</p>
                        <input
                          id="fileInput"
                          type="file"
                          name="file"
                          accept=".jpg,.jpeg,.png"
                          multiple
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>

                    </div>
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="max-w-[250px] lg:w-[150px] bg-[#EDF2FC] border border-dashed border-[#BDCEF1] mt-[10px] rounded-[10px] overflow-hidden mx-auto md:mx-[10px]"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-[250px] h-[146px] lg:w-[150px] lg:h-[107px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-[10px] items-center flex-wrap mr-[5px]">
                  <div className="w-[250px] lg:max-w-[150px] bg-[#EDF2FC] border border-dashed border-[#BDCEF1] lg:pt-[24px] lg:pb-[17px] py-[40px] mt-[20px] rounded-[10px] flex flex-col items-center mx-auto md:mx-[10px] overflow-hidden">
                    {/* <FileUploader handleChange={handleChangeVideo} name="video" types={["MP4", "WebM", "Mkv"]}>
                      <img src={upload} className="mb-[9px] mx-auto" alt="Upload Icon" />
                      <p className="font-man text-[12px] w-[100px] text-center">Drag & Drop video file here</p>
                    </FileUploader> */}
                    <label
                      htmlFor="videoInput"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-all"
                    >
                      <img src={upload} className="mb-[9px] mx-auto" alt="Upload Icon" />
                      <p className="font-man text-[12px] w-[100px] text-center">Drag & Drop video file here</p>
                      <input
                        id="videoInput"
                        type="file"
                        name="video"
                        accept=".mp4,.webm,.mkv"
                        onChange={handleChangeVideo}
                        className="hidden"
                      />
                    </label>

                  </div>
                  {videoURL && (
                    <div className="max-w-[250px] lg:w-[150px] bg-[#EDF2FC] border border-dashed border-[#BDCEF1] mt-[10px] rounded-[10px] overflow-hidden mx-auto md:mx-[10px]">
                      <video width={250} controls loop autoPlay>
                        <source src={videoURL} />
                      </video>
                    </div>
                  )}
                </div>
              </div>
              {/* Form Section */}
              <div className="m-[10px] lg:m-[0px]">
                <p className="pt-[20px] ml-[10px] xl:ml-[78px] lg:bg-white lg:border-b lg:border-[#EEEEEE]">
                  Basic Details
                </p>
                <form
                  className="lg:mx-[10px] xl:mx-[39px] lg:w-[524px]  xl:bg-white xl:border-l xl:border-[#EEEEEE] xl:pl-[39px]"
                  onSubmit={handleSubmit(onSubmitProduct)}
                  noValidate
                >
                  <label className="text-gray-600 text-sm mt-[19px] mb-[13px] block">Product Name</label>
                  <input
                    {...register("productName")}
                    type="text"
                    className="w-full text-gray-800 text-sm px-4 py-3 mb-[5px] rounded border border-gray-300 shadow-md"
                    placeholder="Enter product name here"
                  />
                  <p className="text-xs text-red-600 font-semibold h-[10px] mb-[5px]">
                    {formState.errors.productName?.message}
                  </p>

                  <label className="text-gray-600 text-sm mb-[13px] block">Description</label>
                  <textarea
                    {...register("description")}
                    className="w-full text-gray-800 text-sm px-4 py-3 rounded border mb-[5px] border-gray-300 shadow-md resize-none"
                    rows="6"
                  />
                  <p className="text-xs text-red-600 font-semibold h-[10px] mt-[-5px] mb-[5px]">
                    {formState.errors.description?.message}
                  </p>

                  <label className="text-gray-600 text-sm mb-[13px] block">Category</label>
                  <Select
                    {...register("category")}
                    mode="tags"
                    style={{ width: "100%" }}
                    onChange={(values) => setValue("category", values)}
                    tokenSeparators={[","]}
                    options={categoryOptions}
                    placeholder="Enter category here"
                    suffixIcon={<FiChevronDown style={{ fontSize: "22px", position: "relative", top: "-10px" }} />}
                  />
                  <p className="text-xs text-red-600 font-semibold h-[10px] mt-[-17px] mb-[5px]">
                    {formState.errors.category?.message}
                  </p>

                  <label className="text-gray-600 text-sm mb-[13px] block">Brand Name</label>
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
                        <p className="pt-[50px] lg:w-[524px] mb-[19px] bg-white border-b border-[#EEEEEE]">Pricing & Discounts</p>
                        <div className="flex md:space-x-4 flex-col md:flex-row">
                          <div className="flex-1">
                            <label className=" w-full text-gray-600 text-sm mb-2 block">Regular Price</label>
                            <input
                              type="number"
                              {...register(`variations[${index}].regularPrice`, {
                                onChange: (e) => handleRegularPriceChange(e, index),
                              })}
                              className="w-full text-gray-800 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md mb-[5px]"
                              placeholder="Enter regular price"
                            />
                            <p className="text-xs text-red-600 font-semibold h-[10px] mb-[5px]">
                              {formState.errors.variations?.[index]?.regularPrice?.message}
                            </p>
                          </div>
                          <div className="flex-1">
                            <label className="w-full text-gray-600 text-sm mb-2 block">Seller Price</label>
                            <input
                              type="number"
                              disabled
                              {...register(`variations[${index}].sellingPrice`)}
                              className="w-full text-gray-800 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md mb-[5px]"
                              placeholder="Enter seller price"
                            />
                            <p className="text-xs text-red-600 font-semibold h-[10px] mb-[5px]">
                              {formState.errors.variations?.[index]?.sellingPrice?.message}
                            </p>
                          </div>
                        </div>

                        <label className="text-gray-600 text-sm mb-[13px] block">Discount Management</label>
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
                            <label className="text-gray-800 text-sm">Fixed</label>
                          </div>
                        </div>
                        <p className="text-xs text-red-600 font-semibold h-[10px] mb-[15px]">
                          {formState.errors.variations?.[index]?.discountType?.message}
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
                            {formState.errors.variations?.[index]?.discount?.message}
                          </p>
                        </div>

                        <p className="lg:w-[524px] bg-white  mb-[19px] border-b border-[#EEEEEE]">Stock & Inventory</p>
                        <div className="flex space-x-4 mb-4">
                          <div className="flex-1">
                            <label className="text-gray-600 text-sm mb-2 block">Stock Quantity</label>
                            <input
                              type="number"
                              {...register(`variations[${index}].stock`)}
                              className="w-full text-gray-800 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md mb-[5px]"
                              placeholder="Enter stock quantity"
                            />
                            <p className="text-xs text-red-600 font-semibold h-[10px] mb-[15px]">
                              {formState.errors.variations?.[index]?.stockQuantity?.message}
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
                              {formState.errors.variations?.[index]?.skuId?.message}
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
                      onClick={() =>
                        append({
                          regularPrice: 0,
                          sellingPrice: 0,
                          discountType: "",
                          discount: 0,
                          stock: 0,
                          lowStockAlert: "",
                          outOfStockStatus: "",
                          skuId: "",
                          details: [{ key: "", value: "" }],
                        })
                      }
                    >
                      Add new variation
                    </button>
                  </div>

                  <p className="lg:w-[524px] bg-white  mb-[19px] border-b border-[#EEEEEE]">Shipping Details</p>
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
                      <label className="text-gray-600 text-sm mb-2 block">Available Shipping Methods</label>
                      <select
                        {...register("shippingMethods")}
                        className="w-full text-gray-400 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md mb-[5px]"
                      >
                        <option value="" disabled>
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
                      <label className="text-gray-600 text-sm mb-2 block">Estimated Delivery Time</label>
                      <select
                        {...register("deliveryTime")}
                        className="w-full text-gray-400 text-sm px-4 py-3 rounded transition-all border border-gray-300 shadow-md mb-[5px]"
                      >
                        <option value="" disabled>
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
                      id="freeShipping"
                      {...register("freeShipping")}
                      className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:bg-blue-600 checked:border-0 inline-block  checked:outline outline-blue-600 outline-offset-4 "
                    />
                    <label htmlFor="freeShipping" className="cursor-pointer ml-4">
                      Free Shipping
                    </label>
                  </div>

                  <p className="border-b-[1px] pb-1 mt-12 mb-7">Tags & Active Product</p>
                  <div>
                    <p className="text-[#52575C] mb-2">Tags</p>
                    <Select
                      {...register("tags")}
                      mode="tags"
                      style={{ width: "100%" }}
                      tokenSeparators={[","]}
                      onChange={(values) => setValue("tags", values)}
                      suffixIcon={<FiChevronDown style={{ fontSize: "22px", position: "relative", top: "-10px" }} />}
                    />
                  </div>

                  <Controller
                    control={control}
                    name="isEnabled"
                    defaultValue={true}
                    render={({ field: { value, onChange } }) => (
                      <div className="flex items-center my-8">
                        <label htmlFor="isActives" className="mr-4 cursor-pointer text-[#52575C]">
                          Product Active
                        </label>
                        <Switch checked={value} onChange={onChange} />
                      </div>
                    )}
                  />

                  <div className="flex space-x-4 my-4">
                    <button
                      type="button"
                      className="bg-gray-300 text-gray-800 text-sm px-4 py-2 rounded-full transition duration-300 ease-in-out hover:bg-gray-400"
                      onClick={() => navigate("/product/seller")}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="bg-[#EC2F79] text-white text-sm px-4 py-2 rounded-full hover:bg-[#d6286b]"
                      onClick={handleSaveDraft}
                    >
                      Save to Draft
                    </button>
                    <button
                      type="submit"
                      className="bg-[#EC2F79] text-white text-sm px-4 py-2 rounded-full transition duration-300 ease-in-out hover:bg-[#d6286b]"
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

export default AddProduct;

