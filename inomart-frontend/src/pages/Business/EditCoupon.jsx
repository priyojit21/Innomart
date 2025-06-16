import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import axiosInstance from "../../middleware/axiosInterceptor";
import toast, { Toaster } from "react-hot-toast";
import plus from "../../assets/addCoupon.svg";
import { Switch } from "antd";
import { Select, Space } from "antd";
import { DatePicker, TimePicker } from "antd";
import { couponValidation } from "../../validators/addCoupon";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment/moment";
import Sidebar from "../../components/Seller/Sidebar";
import Navbar from "../../components/Seller/Navbar";
import "./coupon.css";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";



export default function EditCoupon() {
    const [productOptions, setProductOptions] = useState();
    const [categoryOptions, setCategoryOptions] = useState();
    const [open, setOpen] = useState(false);
    const [value, setTimeValue] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [isActive, setisActive] = useState(true);
    const [startTimeError, setStartTimeError] = useState("");
    const [startDateError, setStartDateError] = useState("");
    const [endTimeError, setEndTimeError] = useState("");
    const [endDateError, setEndDateError] = useState("");
    const [isToday, setIsToday] = useState(false);
    const [prevDetails, setPrevDetails] = useState([]);
    const navigate = useNavigate();

    const { couponId } = useParams();

    const openDropdown = (e) => {
        e.preventDefault();
        setOpen(!open);
    };


    const getDetails = async () => {
        try {
            const response = await axiosInstance.get(
                `http://localhost:3000/product/getSingleCoupon/${couponId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            const { amount, category, code, customerLimit, isActive, isFirstTime, minAmount, offerDetails, offerType, product, validFromDateTime, validTillDateTime } = response.data.data;
            setValue('amount', amount);
            setValue('category', category);
            setValue('code', code);
            setValue('customerLimit', customerLimit);
            setValue('isActive', isActive);
            setValue('isFirstTime', isFirstTime);
            setValue('minAmount', minAmount);
            setValue('offerDetails', offerDetails);
            setValue('offerType', offerType);
            setValue('product', product);
            const startDateTime = moment(validFromDateTime);
            const endDateTime = moment(validTillDateTime);

            setStartDate(startDateTime.format("YYYY-MM-DD"));
            setStartTime(dayjs(startDateTime));
            setEndDate(endDateTime.format("YYYY-MM-DD"));
            setEndTime(dayjs(endDateTime));

        } catch (error) {
            console.log(error);
        }
    }

    const DateChange = (date, dateString) => {
        if (endDate && dateString && moment(dateString).isAfter(moment(endDate))) {
            setStartDate(endDate);
            setEndDate(dateString);
        } else {
            setStartDate(dateString);
            if (moment(dateString).isSame(moment(), "day")) {
                setIsToday(true);
            } else {
                setIsToday(false);
            }
        }
    };
    const EndDateChange = (date, dateString) => {
        if (
            startDate &&
            dateString &&
            moment(dateString).isBefore(moment(startDate))
        ) {
            setEndDate(dateString);
            setStartDate(dateString);
        } else {
            setEndDate(dateString);
        }
    };

    const TimeChange = (time) => {
        setStartTime(time);
    };

    const EndTimeChange = (time) => {
        setEndTime(time);
    };
    const disabledEndDate = (current) => {
        return (
            (current && current.isBefore(startDate, "day")) ||
            current.isSame(startDate, "day")
        );
    };
    const disabledStartDate = (current) => {
        return current && current.isBefore(moment(), "day");
    };

    const getAllProducts = async () => {
        try {
            const res = await axiosInstance.post("http://localhost:3000/product/getAll", {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const transformedProducts = res.data.data.map((product) => ({
                label: product.productName,
                value: product._id,
                desc: product.description,
            }));
            setProductOptions(transformedProducts);

        } catch (error) {
            console.error(error.message);
        }
    };
    const getAllCategories = async () => {
        try {
            const res = await axiosInstance.get("http://localhost:3000/category/get", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const transformedCategories = res.data.data.map((category) => ({
                label: category.name,
                value: category._id,
            }));


            setCategoryOptions(transformedCategories);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        getAllProducts();
        getAllCategories();
        getDetails();
    }, []);

    const { register, handleSubmit, control, formState, reset, setValue } = useForm({
        resolver: yupResolver(couponValidation),
    });
    const accessToken = localStorage.getItem("accessToken");

    const addCoupons = async (data) => {
        if (!startDate || !startTime || !endDate || !endTime) {
            if (!startDate) {
                setStartDateError("Start Date is required");
            }
            if (!endDate) {
                setEndDateError("End Date is required");
            }
            if (!startTime) {
                setStartTimeError("Start Time is required");
            }
            if (!endTime) {
                setEndTimeError("End time is requried");
            }
        }
        const now = dayjs();

        if (isToday) {
            if (startTime.isBefore(now)) {
                const updatedStartTime = now.add(2, "hour");
                setStartTime(updatedStartTime);
                setTimeValue("startTime", updatedStartTime, { shouldValidate: true });
            }
        }

        data.minAmount = Number(data.minAmount);
        data.amount = Number(data.amount);
        data.customerLimit = Number(data.customerLimit);
        const formData = {
            ...data,
            isActive,

            validFromDateTime: `${moment(startDate).format("MM-DD-YY")} ${dayjs(
                startTime
            ).format("HH:mm:ss")}`,
            validTillDateTime: `${moment(endDate).format("MM-DD-YY")} ${dayjs(
                endTime
            ).format("HH:mm:ss")}`,
        };

        try {
            const res = await axiosInstance.put(
                `http://localhost:3000/product/updateCoupon/${couponId}`,
                formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
            );


            if (res.data.success) {
                toast.success(res.data.message);
                reset();
                setStartDate();
                setStartTime();
                setEndDate();
                setEndTime();
                setStartDateError();
                setStartTimeError();
                setEndDateError();
                setEndTimeError();
                navigate("/offers")
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
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
                    <Navbar pageName="Offer Management" />
                    <div className="h-[calc(100vh-100px)] bg-[#F7F7F7] p-[8px] md:p-[20px] overflow-scroll">
                        <div className="lg:w-[796px] lg:pt-[11px] bg-white rounded-[10px] xl:[w-900] flex flex-col ">
                            <div className=" text-center md:text-start  font-man font-semibold  text-lg m-5 border-b border-[#EEEEEE] pb-5">
                                Create an offer
                            </div>
                            <div className="max-w-4xl max-sm:max-w-lg font-man font-semibold  p-6">
                                <form
                                    onSubmit={handleSubmit(addCoupons)}
                                    className="flex flex-col gap-[10px] xl:gap-[15px]"
                                >
                                    <div className="md:flex justify-between ">
                                        <label className="text-[16px] mb-2 font-man font-semibold  block text-[#52575C] md:w-[47%] ">
                                            Min Purchase Amount
                                        </label>

                                        <div className="flex flex-col w-full md:w-[52.15%]">
                                            <input
                                                name="minAmount"
                                                type="Number"
                                                min={0}
                                                className="  text-gray-800 text-[16px] py-[10px] px-[7px] rounded transition-all border "
                                                placeholder="Min Purchase Amount"
                                                {...register("minAmount")}

                                            />
                                            <p className="text-xs text-red-600 font-semibold h-4">
                                                {formState.errors.minAmount?.message}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center gap-3 md:flex  md:flex-row md:justify-between ">
                                        <label className="text-[#52575C] text-[16px] mb-2 font-man font-semibold  items-center">
                                            Offer duration and time
                                        </label>
                                        <div className="flex flex-col gap-2 md:w-[52.15%]">
                                            <div className="w-full">
                                                <Space direction="horizontal">
                                                    <div>
                                                        <DatePicker
                                                            onChange={DateChange}
                                                            placeholder="Start Date"
                                                            format="YYYY-MM-DD"
                                                            disabledDate={disabledStartDate}
                                                            value={
                                                                startDate
                                                                    ? moment(startDate, "YYYY-MM-DD")
                                                                    : null
                                                            }
                                                            className="md:w-[130px] md:py-[7px]  2xl:w-[185px] 2xl:py-[16px]"
                                                        />
                                                        {
                                                            <p className="text-xs text-red-600 font-semibold h-4">
                                                                {startDateError}
                                                            </p>
                                                        }
                                                    </div>
                                                    <div>
                                                        <DatePicker
                                                            onChange={EndDateChange}
                                                            placeholder="End Date"
                                                            format="YYYY-MM-DD"
                                                            disabledDate={disabledEndDate}
                                                            value={
                                                                endDate ? moment(endDate, "YYYY-MM-DD") : null
                                                            }
                                                            className="md:w-[130px] md:py-[7px]  2xl:w-[185px] 2xl:py-[16px]"
                                                        />
                                                        {
                                                            <p className="text-xs text-red-600 font-semibold h-4">
                                                                {endDateError}
                                                            </p>
                                                        }
                                                    </div>
                                                </Space>
                                            </div>
                                            <div className="w-full  ">
                                                <Space direction="horizontal">
                                                    <div>
                                                        <TimePicker
                                                            value={startTime}
                                                            onChange={TimeChange}
                                                            placeholder="Start Time"
                                                            format="HH:mm:ss"
                                                            className="md:w-[130px] md:py-[7px]  2xl:w-[185px] 2xl:py-[16px]"
                                                        />
                                                        {
                                                            <p className="text-xs text-red-600 font-semibold h-4">
                                                                {startTimeError}
                                                            </p>
                                                        }
                                                    </div>

                                                    <div>
                                                        <TimePicker
                                                            value={endTime}
                                                            name="endTime"
                                                            onChange={EndTimeChange}
                                                            format="HH:mm:ss"
                                                            className="md:w-[130px] md:py-[7px] 2xl:w-[185px] 2xl:py-[16px]"
                                                        />
                                                        {
                                                            <p className="text-xs text-red-600 font-semibold h-4">
                                                                {endTimeError}
                                                            </p>
                                                        }
                                                    </div>
                                                </Space>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center gap-3 md:flex  md:flex-row md:justify-between">
                                        <label className="text-[#52575C] text-[16px] font-man font-semibold  mb-2 block md:w-[47%]">
                                            Offer Details
                                        </label>
                                        <div className="flex flex-col w-full md:w-[52.15%]">
                                            <textarea
                                                name="offerDetails"
                                                className="bg-gray-100  text-gray-800 text-[16px] rounded transition-all px-[10px] py-[20px] "
                                                placeholder="Type details"
                                                {...register("offerDetails")}
                                            />
                                            <p className="text-xs text-red-600 font-semibold h-4">
                                                {formState.errors.offerDetails?.message}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center gap-3 md:flex  md:flex-row md:justify-between">
                                        <label className="text-[#52575C] text-[16px] mb-2 block md:w-[47%]">
                                            Coupon Code
                                        </label>
                                        <div className="flex flex-col w-full md:w-[52.15%]">
                                            <input
                                                name="code"
                                                type="text"
                                                className="bg-gray-100  text-gray-800 text-[16px]  rounded transition-all py-[10px] px-[7px] font-man font-semibold"
                                                placeholder="Type Coupon Code"
                                                {...register("code")}
                                            />
                                            <p className="text-xs text-red-600 font-semibold h-4">
                                                {formState.errors.code?.message}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center gap-0 md:flex  md:flex-row md:justify-between">
                                        <label className="text-[#52575C] text-[16px] font-semibold mb-2 block md:w-[47%] ">
                                            Offer Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="offerType"
                                            className="w-full py-[10px] px-[7px] rounded-[10px] border border-[#DDDDDD] text-[#B0B3B6] focus:outline-none focus:ring-2 focus:ring-[#EC2F79] md:w-[52.15%]"
                                            {...register("offerType")}
                                            placeholder="Select Type"
                                        >
                                            <option value="flat">Flat</option>
                                            <option value="percentage">Percentage</option>
                                        </select>
                                        <p className="text-xs text-red-600 font-semibold h-4">
                                            {formState.errors.offerType?.message}
                                        </p>
                                    </div>
                                    <div className="flex flex-col justify-center gap-3 md:flex  md:flex-row md:justify-between">
                                        <label className="text-[#52575C] text-[16px] font-semibold mb-2 block md:w-[47%]">
                                            Offer Amount
                                        </label>
                                        <div className="flex flex-col w-full md:w-[52.15%]">
                                            <input
                                                name="amount"
                                                type="Number"
                                                className="  text-gray-800 text-[16px]  rounded transition-all border py-[10px] px-[7px] font-man font-semibold "
                                                placeholder="Offer Amount"
                                                min={0}
                                                {...register("amount", { valueAsNumber: true })}
                                            />
                                            <p className="text-xs text-red-600 font-semibold h-4">
                                                {formState.errors.amount?.message}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center gap-3 md:flex  md:flex-row md:justify-between">
                                        <label className="text-[#52575C] text-[16px] mb-2 block md:w-[47%]">
                                            Customer Limit
                                        </label>
                                        <div className="flex flex-col w-full md:w-[52.15%]">
                                            <input
                                                name="customerLimit"
                                                type="Number"
                                                className="  text-gray-800 text-[16px] rounded transition-all border py-[10px] px-[7px] font-man font-semibold "
                                                placeholder="Customer Limit"
                                                min={0}
                                                {...register("customerLimit", { valueAsNumber: true })}
                                            />
                                            <p className="text-xs text-red-600 font-semibold h-4">
                                                {formState.errors.customerLimit?.message}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center gap-3 md:flex  md:flex-row md:justify-between relative">
                                        <label className="text-[#52575C] text-[16px] font-semibold md:w-[47%]">
                                            Choose Product <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex flex-col w-full md:w-[52.15%]">
                                            <Controller
                                                name="product"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        mode="multiple"
                                                        className=" custom-select "
                                                        placeholder="Select Product"
                                                        options={productOptions}
                                                        popupClassName=""
                                                        open={open}
                                                    />
                                                )}
                                            />
                                            <button
                                                className="cursor-pointer absolute right-[5px] bottom-[48px]"
                                                onClick={openDropdown}
                                            >
                                                <img src={plus} alt="Add Product" />
                                            </button>
                                            <p className="text-xs text-red-600 font-semibold h-4">
                                                {formState.errors.product?.message}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center gap-3 md:flex  md:flex-row md:justify-between">
                                        <label className="text-[#52575C] text-[16px] font-semibold font-man  md:w-[47%]">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex flex-col w-full md:w-[52.15%]">
                                            <Controller
                                                name="category"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        mode="multiple"
                                                        className="custom-select "
                                                        placeholder="Select category"
                                                        options={categoryOptions}
                                                    />
                                                )}
                                            />
                                            <p className="text-xs text-red-600 font-semibold h-4">
                                                {formState.errors.category?.message}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center md:justify-end">
                                        <input
                                            name="isFirstTime"
                                            type="checkbox"
                                            className="w-4 h-4 mr-3  outline-none focus:ring-offset-4 focus:ring-[#007bff] "
                                            {...register("isFirstTime")}
                                        />
                                        <label
                                            htmlFor="checkbox"
                                            className="text-[#707070] font-man font-semibold "
                                        >
                                            First time purchase
                                        </label>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex gap-2 items-center">
                                            <label
                                                htmlFor="isActive"
                                                className="cursor-pointer font-man font-semibold "
                                            >
                                                Offer Active
                                            </label>
                                            <Switch
                                                id="isActive"
                                                checked={isActive}
                                                onChange={(checked) => {
                                                    setisActive(checked);
                                                }}
                                            />
                                        </div>

                                        <div className="">
                                            <button
                                                className="text-[14px] bg-[#EC2F79] text-white rounded-[10px] px-4 py-3"
                                                type="Submit"
                                            >
                                                Submit
                                            </button>
                                        </div>
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
}
