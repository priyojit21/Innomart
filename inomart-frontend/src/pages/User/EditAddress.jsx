import axiosInstance from '../../middleware/axiosInterceptor';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import Select from "react-select";
import ReactFlagsSelect from "react-world-flags";
import toast, { Toaster } from "react-hot-toast";
import { yupResolver } from '@hookform/resolvers/yup';
import { userAddressValidation } from '../../validators/userAddressValidation';

import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';
import Sidebar from '../../components/user/Sidebar';

export default function EditAddress() {
    const { register, handleSubmit, formState, reset, setValue } = useForm({
        resolver: yupResolver(userAddressValidation),
    });
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [countries, setCountries] = useState([]);
    const accessToken = localStorage.getItem("accessToken");
    const [prevDetails, setPrevDetails] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();



    const formValues = [
        {
            label: "Name",
            placeholder: "Enter your Name",
            register: "name"
        },
        {
            label: "Street",
            placeholder: "Enter Street Name",
            register: "street"
        },
        {
            label: "City",
            placeholder: "Enter City Name",
            register: "city"
        },
        {
            label: "State",
            placeholder: "Enter your State",
            register: "state"
        },
        {
            label: "Landmark",
            placeholder: "Enter your LandMark",
            register: "landMark"
        }
    ]


    const getDetails = async () => {
        try {
            const response = await axiosInstance.get(
                `http://localhost:3000/user/getOneAddress/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log("my details", response.data.data);
            for (const data in response.data.data) {
                console.log("ii", data, response.data.data[data]);
                if (data === "pinCode")
                    response.data.data[data] += '';
                setValue(data, response.data.data[data])
            }
            setPrevDetails(response.data.data);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axiosInstance.get("https://restcountries.com/v3.1/all");
                const countryData = response.data.map((country, id) => ({
                    code: country.cca2,
                    value: country.name.common,
                    key: id,
                }));
                setCountries(countryData);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };
        (async () => {
            await fetchCountries();
            await getDetails();
        })();

    }, []);

    useEffect(() => {
        const country = countries.find(country => country.code === prevDetails.country);
        setSelectedCountry(country);
        setValue("country", country?.code || "");
    }, [countries, prevDetails])


    const handleCountryChange = (country) => {
        console.log(country);
        setSelectedCountry(country);
        setValue("country", country?.code || "");
    };

    const submitAddressInfo = async (data) => {
        data.pinCode = Number(data.pinCode);
        console.log("new data", data);
        const newData = {
            name: data.name,
            street: data.street,
            city: data.city,
            state: data.state,
            landMark: data.landMark,
            country: data.country,
            pinCode: Number(data.pinCode),
            houseNo: data.houseNo,
            type: data.type,
        }
        try {
            const response = await axiosInstance.put(
                `http://localhost:3000/user/editUserAddress/${id}`,
                newData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
            );
            console.log("my resp ", response);

            if (response.data.success) {
                console.log("hii", response.data.success);
                toast.success(response.data.message);
                navigate("/address");
                reset();
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data.message || "Error Occurred");
        }
    };



    return (
        <>
            <div className="lg:flex items-start">
                <div className="flex-grow">
                    <Sidebar />
                </div>
                <div className="lg:flex lg:flex-col lg:w-full">
                    <Navbar pageName="User Address Information" />
                    <div className="h-screen bg-[#F7F7F7] p-[20px] overflow-scroll">
                        <div className='bg-white rounded-[10px] flex items-center flex-col p-[20px]'>
                            <p className="font-man font-bold text-[22px] mb-[20px] text-[#5E5F63]">
                                Update Your Address Information
                            </p>
                            <form
                                className="w-full max-w-[429px]"
                                onSubmit={handleSubmit(submitAddressInfo)}
                            >
                                {formValues.map((data, index) => {
                                    return <div key={index}>
                                        <label className="text-[#52575C] text-[16px] font-semibold mb-[8px] flex items-center gap-1">
                                            {data.label} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name={data.register}
                                            // defaultValue={prevDetails[data.register]}
                                            type="text"
                                            className="w-full pt-[18px] pb-[19px] pl-[25px] rounded-[10px] border border-[#DDDDDD] focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                                            placeholder={data.placeholder}
                                            {...register(`${data.register}`)}
                                        />
                                        <p className="text-xs text-red-600 font-semibold h-4">
                                            {formState.errors[data.register]?.message || ""}
                                        </p>
                                    </div>
                                })}

                                <div className="flex flex-col md:flex-row gap-6 mt-5">
                                    <div className="md:w-1/2">
                                        <label className="text-[#52575C] text-[16px] font-semibold mb-[8px] mt-[20px]">
                                            House Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="houseNo"
                                            type="text"
                                            // defaultValue={prevDetails.houseNo}
                                            className="w-full pt-[15px] pb-[19px] pl-[25px] rounded-[10px] border border-[#DDDDDD] focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                                            placeholder="Enter House Number"
                                            {...register("houseNo")}
                                        />
                                        <p className="text-xs text-red-600 font-semibold mt-2">
                                            {formState.errors.houseNo?.message || ""}
                                        </p>
                                    </div>

                                    <div className="md:w-1/2">
                                        <label className="text-[#52575C] text-[16px] font-semibold mb-[8px] mt-[20px]">
                                            Address Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="type"
                                            // defaultValue={prevDetails.type}
                                            className="w-full pt-[18px] pb-[19px] pl-[25px] rounded-[10px] border border-[#DDDDDD] text-black focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                                            {...register("type")}
                                        >
                                            <option value="">Select address type</option>
                                            {prevDetails.type === "Home" ? <option value="Home" selected>Home</option> : <option value="Home" >Home</option>}

                                            {prevDetails.type === "Office" ? <option value="Office" selected>Office</option> : <option value="Office" >Office</option>}

                                        </select>
                                        <p className="text-xs text-red-600 font-semibold mt-2">
                                            {formState.errors.type?.message || ""}
                                        </p>
                                    </div>
                                </div>



                                <div className="flex flex-col md:flex-row gap-4 mt-5">
                                    <div className="md:w-1/2">
                                        <label className="text-[#52575C] text-[16px] font-semibold mb-[8px] mt-[20px]">
                                            PinCode <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="pinCode"
                                            // defaultValue={prevDetails.pinCode}
                                            type="text"
                                            className="w-full pt-[18px] pb-[19px] pl-[25px] rounded-[10px] border border-[#DDDDDD] focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
                                            placeholder="Enter zip code"
                                            {...register("pinCode")}
                                        />
                                        <p className="text-xs text-red-600 font-semibold h-4">
                                            {formState.errors.pinCode?.message || ""}
                                        </p>
                                    </div>

                                    <div className="md:w-1/2">
                                        <label className="text-[#52575C] text-[16px] font-semibold mb-[8px] mt-[20px]">
                                            Country <span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            placeholder={<div>Country</div>}
                                            menuPlacement="top" 
                                            options={countries}
                                            isSearchable={true}
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    height: 62,
                                                    fontSize: "16px",
                                                    padding: "5px",
                                                    borderRadius: "10px",
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    fontSize: "16px",
                                                }),
                                                option: (base, { isFocused }) => ({
                                                    ...base,
                                                    backgroundColor: isFocused ? "#EC2F79" : "white",
                                                    color: isFocused ? "white" : "black",
                                                    fontSize: "16px",
                                                    padding: "10px",
                                                }),
                                            }}
                                            getOptionLabel={(e) => (
                                                <div className="flex items-center">
                                                    <span className="mx-2 ">{e.value}</span>
                                                    <ReactFlagsSelect code={e.code} width={35} />
                                                </div>
                                            )}
                                            onChange={handleCountryChange}
                                            value={selectedCountry}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                        />
                                        <p className="text-xs text-red-600 font-semibold h-4">
                                            {formState.errors.country?.message || ""}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-[#EC2F79] text-white rounded-[10px] w-full mt-[21px]  pt-[13px] pb-[17.5px] font-man text-[14px]"
                                >
                                    Update
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    )
}
