import { Checkbox, Slider, Dropdown } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useState, useMemo, useEffect } from "react";
import "./dashboard.css";
import filter from "../../assets/seller/filter.svg";
import { IoSearch } from "react-icons/io5";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { RxCross1 } from "react-icons/rx";
import "@ant-design/v5-patch-for-react-19";
import axiosInstance from "../../middleware/axiosInterceptor";
import Sidebar from "../../components/user/Sidebar";
import Navbar from "../../components/user/Navbar";
import { ProductCard } from "../../components/Helper/productCard";
import { useDispatch } from "react-redux";
import { showWishlist } from "../../features/productDetailSlice.js";
import { Toaster } from "react-hot-toast";

const CustomerDashboard = () => {
  const [price, setPrice] = useState([0, 10000]);
  const [filterOption, setFilterOption] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const [filterSideBar, setFilterSideBar] = useState(false);
  const [filterValue, setFilterValue] = useState({
    discount: 0,
    sortby: "date",
    order: "asc",
    findBy: "",
    lowestPrice: 0,
    highestPrice: -1,
    stock: "",
    rating: 0,
    filterOption: {},
  });

  const updateFilterValue = (key, value) => {
    setFilterValue((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const marks = useMemo(
    () => ({
      [price[0]]: price[0],
      [price[1]]: price[1],
    }),
    [price]
  );

  const discountOptions = [];
  for (let i = 10; i <= 60; i = i + 10) {
    discountOptions.push({ label: `${i}%`, value: i });
  }

  const ratingOption = [];
  for (let i = 5; i > 0; i--) {
    ratingOption.push({ label: `${i} star`, value: i });
  }
  ratingOption.push({ label: "Verified", value: 0 });

  const sortItems = [
    { label: "Date", key: "date_asc", icon: <ArrowUpOutlined /> },
    { label: "Date", key: "date_desc", icon: <ArrowDownOutlined /> },
    { label: "Price", key: "price_asc", icon: <ArrowUpOutlined /> },
    { label: "Price", key: "price_desc", icon: <ArrowDownOutlined /> },
    { label: "Discount", key: "discount_asc", icon: <ArrowUpOutlined /> },
    { label: "Discount", key: "discount_desc", icon: <ArrowDownOutlined /> },
  ];

  const stockOption = [
    { label: "In Stock", value: "in" },
    { label: "Out of Stock", value: "out" },
    { label: "Low Stock", value: "low" },
  ];

  const getAllProduct = async () => {
    try {
      const res = await axiosInstance.post(`product/getAll`, filterValue, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setAllProducts(res.data.data);
      setFilterOption(res.data.filterOption);
    } catch (error) {
      setAllProducts([]);
      console.log(error.message);
    }
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      getAllProduct();
    }, 1000);
    return () => clearTimeout(getData);
  }, [filterValue.findBy, filterValue.highestPrice, filterValue.lowestPrice]);

  useEffect(() => {
    getAllProduct();
  }, [
    filterValue.discount,
    filterValue.filterOption,
    filterValue.order,
    filterValue.rating,
    filterValue.sortby,
    filterValue.stock,
  ]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showWishlist());
  }, [dispatch]);



  return (
    <>
      <div className="lg:flex items-start">
        <div className="flex-grow">
          <Sidebar />
        </div>
        <div className="lg:flex lg:flex-col lg:w-full">
          <Navbar pageName="Products" />
          <div className="h-[calc(100vh-100px)] bg-[#e3e0e0] p-[20px] flex gap-5">
            {filterSideBar && (
              <div className="max-w-[366px] ps-[23px] py-[21px] px-[50px] rounded-xl bg-white h-full overflow-scroll scrollbar-none max-h-[calc(100vh-120px)] absolute right-0 z-30 shadow-2xl">
                <div className="flex gap-2 mb-6 relative">
                  <img src={filter} alt="Filter" />
                  <h2 className="font-man text-[20px]">Filter</h2>
                  <RxCross1
                    size={18}
                    className="absolute right-0 top-2 cursor-pointer"
                    onClick={() => setFilterSideBar(false)}
                  />
                </div>
                <div className="relative">
                  <h3 className="font-man font-medium text-lg mb-6">
                    Price & Discount
                  </h3>
                  <Slider
                    range
                    marks={marks}
                    min={0}
                    max={10000}
                    value={price}
                    onChange={(newPrice) => {
                      setPrice(newPrice);
                      updateFilterValue("lowestPrice", newPrice[0]);
                      updateFilterValue(
                        "highestPrice",
                        newPrice[1] !== 10000 ? newPrice[1] : -1
                      );
                    }}
                  />
                  <Checkbox.Group
                    className="checkbox-group-container"
                    options={discountOptions}
                    onChange={(checkedValues) =>
                      updateFilterValue("discount", checkedValues[0] || 0)
                    }
                  />
                </div>

                <div className="mt-7">
                  <h3 className="font-man font-medium text-lg mb-6">
                    Stock & Availability
                  </h3>
                  <Checkbox.Group
                    className="checkbox-group-container"
                    options={stockOption}
                    onChange={(checkedValues) =>
                      updateFilterValue("stock", checkedValues[0] || "")
                    }
                  />
                </div>

                <div className="mt-7">
                  <h3 className="font-man font-medium text-lg mb-6">
                    Ratings & Reviews
                  </h3>
                  <Checkbox.Group
                    className="checkbox-group-container"
                    options={ratingOption}
                    onChange={(checkedValues) =>
                      updateFilterValue("rating", checkedValues[0] || "")
                    }
                  />
                </div>

                <div className="mt-7">
                  <h3 className="font-man font-medium text-lg mb-6">
                    Product Attributes
                  </h3>
                  {Object.keys(filterOption).map((key, index) => (
                    <div key={index}>
                      {key.toLowerCase() !== "color" ? (
                        <div className="flex flex-wrap mt-5 gap-2">
                          {filterOption[key].map((option, idx) => (
                            <div
                              key={idx}
                              className="px-4 py-2 text-lg rounded-sm cursor-pointer"
                              style={{
                                backgroundColor:
                                  filterValue?.filterOption[key] === option
                                    ? "#EC2F79"
                                    : "#EDF2FC",
                                color:
                                  filterValue?.filterOption[key] === option
                                    ? "white"
                                    : "#64676F",
                              }}
                              onClick={() => {
                                setFilterValue((prevValues) => {
                                  const updatedFilterOption = {
                                    ...prevValues.filterOption,
                                  };
                                  if (updatedFilterOption[key] === option) {
                                    delete updatedFilterOption[key];
                                  } else {
                                    updatedFilterOption[key] = option;
                                  }
                                  return {
                                    ...prevValues,
                                    filterOption: updatedFilterOption,
                                  };
                                });
                              }}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap mt-5 gap-2">
                          {filterOption[key].map((color, idx) => (
                            <div
                              key={idx}
                              className="rounded-full w-6 h-6 lg:w-7 lg:h-7 cursor-pointer hover:brightness-50"
                              style={{
                                backgroundColor: color,
                                border:
                                  filterValue?.filterOption[key] === color &&
                                  "2px solid black",
                              }}
                              onClick={() => {
                                setFilterValue((prevValues) => {
                                  const updatedFilterOption = {
                                    ...prevValues.filterOption,
                                  };
                                  if (updatedFilterOption[key] === color) {
                                    delete updatedFilterOption[key];
                                  } else {
                                    updatedFilterOption[key] = color;
                                  }
                                  return {
                                    ...prevValues,
                                    filterOption: updatedFilterOption,
                                  };
                                });
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl w-full h-full overflow-scroll scrollbar-none">
              <div className="flex items-center flex-wrap gap-6 justify-between p-5 pt-0">
                <div className="flex items-center flex-wrap-reverse gap-6">
                  <div className="border-[#E7E7E7] border-[1px] bg-white sm:w-72 rounded-md overflow-hidden flex p-2 gap-2">
                    <IoSearch size={20} color="#CACCCF" className="mt-0.5" />
                    <input
                      type="search"
                      className="w-full outline-none"
                      placeholder="Search products..."
                      value={filterValue.findBy}
                      onChange={(e) =>
                        updateFilterValue("findBy", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Dropdown
                    menu={{
                      items: sortItems.map(({ key, label, icon }) => ({
                        key: key,
                        label: (
                          <span
                            onClick={() => {
                              updateFilterValue("sortby", key.split("_")[0]);
                              updateFilterValue("order", key.split("_")[1]);
                            }}
                          >
                            {icon} {label}
                          </span>
                        ),
                      })),
                    }}
                    placement="bottom"
                    arrow={{ pointAtCenter: true }}
                  >
                    <button className="flex items-center text-[#5D5D5D] border-[1px] border-[#3E4E4E4] px-3.5 py-2.5 focus:outline-none bg-white hover:bg-[#EC2F79] hover:text-white rounded-md">
                      <HiMiniArrowsUpDown className="mr-2" color="#5D5D5D" />
                      Sort
                    </button>
                  </Dropdown>

                  <button
                    className="flex items-center text-[#5D5D5D] border-[1px] border-[#3E4E4E4] px-3.5 py-2.5 focus:outline-none hover:bg-[#EC2F79] bg-white hover:text-white rounded-md"
                    onClick={() => setFilterSideBar(!filterSideBar)}
                  >
                    <img src={filter} alt="Filter" />
                    <p className="font-man ml-2">Filter</p>
                  </button>
                </div>
              </div>
              <div className="gap-[17px] flex flex-wrap justify-center lg:justify-start">
                {allProducts?.map((element) => {
                  return <ProductCard
                    key={element._id}
                    productName={element.productName}
                    productPrice={element.variation[0].sellingPrice}
                    productImage={element.productImages[0]}
                    productId={element._id}
                    variationId={element.variation[0]._id}
                  />
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default CustomerDashboard;