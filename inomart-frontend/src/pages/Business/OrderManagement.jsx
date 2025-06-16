import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../components/Seller/Sidebar";
import Navbar from "../../components/Seller/Navbar";
import Searchbox from "../../components/Helper/Searchbox";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { IoFilterOutline } from "react-icons/io5";
import Table from "../../components/Helper/Table";
import { Dropdown } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import {
  searchProduct,
  setSelectedOption,
  setSortField,
  setSortOrder,
  setStatusState,
} from "../../features/productDetailSlice";

export default function OrderManagement() {
  const dispatch = useDispatch();
  const selectedOption = useSelector((state) => state.app.selectedOption);
  const statusState = useSelector((state) => state.app.statusState);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const sortOrder = useSelector((state) => state.app.sortOrder);
  const sortField = useSelector((state) => state.app.sortField);

  const filters = [
    "All",
    "Pending",
    "Shipped",
    "Out For Delivery",
    "Delivered",
    "Refund",
    "Replace",
    "Cancel",
  ];
  const [flag, setFlag] = useState(false);

  useEffect(() => {
  }, [dispatch, selectedOption]);

  const updateSortValue = (key, value) => {
    if (key === "sortOrder") {
      dispatch(setSortOrder(value));
    }
    if (key === "sortField") {
      dispatch(setSortField(value));
    }
  };

  const handleSelectOption = (option) => {
    dispatch(setSelectedOption(option));
  };

  const handleSelectFilters = (option) => {
    if (option === "All") {
      dispatch(setStatusState(""));
      dispatch(setSelectedOption(""));
      dispatch(searchProduct(""));
    } else {
      dispatch(setStatusState(option));
    }
  };
  const sortItems = [
    { label: "Order At ", key: "orderAt_asc", icon: <ArrowUpOutlined /> },
    { label: "Order At ", key: "orderAt_desc", icon: <ArrowDownOutlined /> },
    { label: "Quantity", key: "quantity_asc", icon: <ArrowUpOutlined /> },
    { label: "Quantity", key: "quantity_desc", icon: <ArrowDownOutlined /> },
    { label: "Price", key: "price_asc", icon: <ArrowUpOutlined /> },
    { label: "Price", key: "price_desc", icon: <ArrowDownOutlined /> },
  ];
  const selectedKey = `${sortField}_${sortOrder}`;
  return (
    <>
      <div className="lg:flex items-start">
        <div className="flex-grow">
          <Sidebar />
        </div>
        <div className="lg:flex lg:flex-col lg:w-full">
          <Navbar pageName="Order Management" />

          <div className="h-[calc(100vh-100px)] bg-[#e3e0e0] p-[20px]  overflow-scroll">
            <div className="w-full bg-white rounded-xl p-4 shadow-md">
              <div className="flex flex-wrap gap-2 w-full mb-4">
                {filters.map((btn, index) => (
                  <button
                    key={index}
                    className={`flex text-[#1A1A1A] border-0 py-2 px-4 focus:outline-none rounded-md text-base ${selectedIndex === index
                      ? "bg-[#EC2F79] text-white"
                      : "bg-[#bebdbd]"
                      }`}
                    onClick={() => {
                      handleSelectFilters(btn);
                      setSelectedIndex(index);
                    }}
                  >
                    {btn}
                  </button>
                ))}
              </div>
              <div className="flex flex-col lg:flex-row justify-between gap-4 lg:pt-[50px]">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="check"
                      id="select"
                      className="mx-2 w-[16px] h-[16px]"
                    />
                    <label htmlFor="select" className="text-base">
                      Select all
                    </label>
                  </div>
                  <Searchbox />
                </div>
                <div className="flex gap-4 justify-between">
                  <Dropdown
                    menu={{
                      items: sortItems.map(({ key, label, icon }) => ({
                        key: key,
                        label: (
                          <span
                            onClick={() => {
                              updateSortValue("sortField", key.split("_")[0]);
                              updateSortValue("sortOrder", key.split("_")[1]);
                            }}
                            className={
                              key === selectedKey
                                ? "font-bold text-[#EC2F79]"
                                : ""
                            }
                          >
                            {icon} {label}
                          </span>
                        ),
                      })),
                    }}
                    placement="bottom"
                    arrow={{ pointAtCenter: true }}
                  >
                    <button className="flex items-center text-[#1A1A1A] bg-[#d3d2d2] border-0 py-2 px-8 focus:outline-none hover:bg-[#EC2F79] hover:text-white rounded-md text-lg">
                      <HiMiniArrowsUpDown className="mr-2" color="#5D5D5D" />
                      Sort
                    </button>
                  </Dropdown>
                  <div className="relative inline-block text-left">
                    <div>
                      <button
                        className="flex items-center text-[#1A1A1A] bg-[#d3d2d2] border-0 py-2 px-6 focus:outline-none hover:bg-[#EC2F79] hover:text-white rounded-md text-lg w-full"
                        onClick={() => setFlag(!flag)}
                      >
                        <IoFilterOutline className="mr-2" />
                        Filter
                      </button>
                    </div>
                    {flag && (
                      <div
                        className={`absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg transition-transform transform ${flag ? "scale-y-100" : "scale-y-0"
                          } origin-top`}
                      >
                        <ul className="py-1">
                          <li
                            onClick={() => {
                              handleSelectOption("firstName");
                              setFlag(false);
                            }}
                            className={`cursor-pointer hover:bg-[#F1F1F1] px-4 py-2 ${selectedOption === "firstName"
                              ? "bg-[#EC2F79] text-white"
                              : ""
                              }`}
                          >
                            Customer
                          </li>
                          <li
                            onClick={() => {
                              handleSelectOption("productName");
                              setFlag(false);
                            }}
                            className={`cursor-pointer hover:bg-[#F1F1F1] px-4 py-2 ${selectedOption === "productName"
                              ? "bg-[#EC2F79] text-white"
                              : ""
                              }`}
                          >
                            Product
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <hr className="bg-[#E9E9E9] my-[20px]" />
              <Table />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
