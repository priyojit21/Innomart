import { Checkbox, Slider, Dropdown } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import Navbar from "../../components/Seller/Navbar";
import Sidebar from "../../components/Seller/Sidebar";
import { useState, useMemo, useEffect } from "react";
import "./getAllProduct.css";
import filter from "../../assets/seller/filter.svg";
import { IoSearch } from "react-icons/io5";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { GoPlus } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import "@ant-design/v5-patch-for-react-19";
import { Link } from "react-router-dom";
import axiosInstance from "../../middleware/axiosInterceptor";
import ProductControlModal from "../../components/Seller/ProductControlModal";
import { Toaster } from "react-hot-toast";
import { Space } from 'antd';


const GetAllProduct = () => {
  const [price, setPrice] = useState([0, 10000]);
  const [filterOption, setFilterOption] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const [filterSideBar, setFilterSideBar] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [isDraft, setIsDraft] = useState(false)
  const [drafts, setDrafts] = useState([])
  const [deleteTrigger, setDeleteTrigger] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const handleCheckboxChange = (product, e) => {
    e.stopPropagation();
    handleProductSelect(product._id);
    setOpen(true);
  };

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

  const sortDraftItems = [
    { label: "Date", key: "date_asc", icon: <ArrowUpOutlined /> },
    { label: "Date", key: "date_desc", icon: <ArrowDownOutlined /> },
  ];

  const indeterminate =
    selectedProducts.length > 0 && selectedProducts.length < allProducts.length;

  const handleSelectAll = () => {
    if (isDraft) {
      if (selectedProducts.length === drafts.length) {
        setSelectedProducts([]);
      } else {
        setSelectedProducts(drafts.map((product) => product._id));
      }
    } else {
      if (selectedProducts.length === allProducts.length) {
        setSelectedProducts([]);
      } else {
        setSelectedProducts(allProducts.map((product) => product._id));
      }
    }
  };

  const handleProductSelect = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

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

  const getAllDraft = async () => {
    try {
      const data = {
        isDraft: true
      }
      const res = await axiosInstance.post(`product/getDrafts`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(res)
      setDrafts(res.data.data)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllDraft()
  }, [deleteTrigger])

  const checkWindowSize = () => {
    window.innerWidth >= 768 ? setFilterSideBar(true) : setFilterSideBar(false);
  };

  useEffect(() => {
    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);
  }, []);

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
    deleteTrigger,
    updateTrigger,
  ]);
  useEffect(() => {
    if (selectedProducts.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [selectedProducts.length]);
  return (
    <div className="lg:flex items-start">
      <div className="flex-grow">
        <Sidebar />
      </div>
      <div className="lg:flex lg:flex-col lg:w-full">
        <Navbar pageName="Products" />
        <div className="h-[calc(100vh-100px)] bg-[#e3e0e0] p-[20px] flex gap-5">
          {filterSideBar && (
            <div className={`max-w-[366px] ps-[23px] py-[21px] px-[50px] rounded-xl bg-white h-full overflow-scroll scrollbar-none max-h-[calc(100vh-140px)] absolute left-0 z-30 shadow-2xl md:static md:shadow-none ${isDraft ? 'opacity-50 backdrop-blur-md pointer-events-none cursor-not-allowed ' : ''}`}>
              <div className="flex gap-2 mb-6 relative">
                <img src={filter} alt="Filter" />
                <h2 className="font-man text-[20px]">Filter</h2>
                <RxCross1
                  size={18}
                  className="absolute right-0 top-2 md:hidden"
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

          <div className="rounded-xl bg-white w-full h-full overflow-scroll scrollbar-none">
            <div className="flex items-center flex-wrap gap-6 justify-between p-5 pt-[16px]">
              <div className="flex items-center flex-wrap-reverse gap-6">
                <Checkbox
                  indeterminate={indeterminate}
                  checked={isDraft ? selectedProducts.length === drafts.length : selectedProducts.length === allProducts.length}
                  onChange={handleSelectAll}
                >
                  Select all
                </Checkbox>

                {!isDraft && <div className="border-[#E7E7E7] border-[1px] sm:w-72 rounded-md overflow-hidden flex p-2 gap-2">
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
                </div>}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {!isDraft ?
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
                    <button className="flex items-center text-[#5D5D5D] border-[1px] border-[#3E4E4E4] px-3.5 py-2.5 focus:outline-none hover:bg-[#EC2F79] hover:text-white rounded-md">
                      <HiMiniArrowsUpDown className="mr-2" color="#5D5D5D" />
                      Sort
                    </button>
                  </Dropdown> :
                  <Dropdown
                    menu={{
                      items: sortDraftItems.map(({ key, label, icon }) => ({
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
                    {!isDraft && <button className="flex items-center text-[#5D5D5D] border-[1px] border-[#3E4E4E4] px-3.5 py-2.5 focus:outline-none hover:bg-[#EC2F79] hover:text-white rounded-md">
                      <HiMiniArrowsUpDown className="mr-2" color="#5D5D5D" />
                      Sort
                    </button>}
                  </Dropdown>
                }
                {!isDraft && <button
                  className="flex items-center text-[#5D5D5D] border-[1px] border-[#3E4E4E4] px-3.5 py-2.5 focus:outline-none hover:bg-[#EC2F79] hover:text-white rounded-md md:hidden"
                  onClick={() => setFilterSideBar(!filterSideBar)}
                >
                  <img src={filter} alt="Filter" />
                  <p className="font-man ml-2">Filter</p>
                </button>}
                <button
                  type="button"
                  className={`${isDraft ? 'bg-[#EC2F79]' : 'bg-[#827e7e]'
                    } text-white rounded-[10px] font-man flex items-center gap-1 py-2.5 px-4 hover:bg-[#f92174]`}
                  onClick={() => {
                    setIsDraft(prev => !prev);
                    getAllDraft();
                  }}
                >
                  Drafts
                </button>

                <Link to="/product/seller/addproduct">
                  <button
                    type="submit"
                    className="bg-[#EC2F79] text-white rounded-[10px] font-man flex items-center gap-1 py-2.5 px-4 hover:bg-[#f92174]"
                  >
                    <GoPlus size={22} />
                    Add New
                  </button>
                </Link>
              </div>
            </div>
            {!isDraft ?
              <div className="border-t-2 p-5 grid grid-cols-1 2xl:grid-cols-2 gap-x-10 2xl:gap-x-20 gap-y-5 relative">
                {allProducts.map((product) => {
                  const items = [
                    {
                      key: '1',
                      label: (
                        <Link to={`singleProduct/${product._id}`}>
                          <p>View</p>
                        </Link>
                      ),
                    },
                    {
                      key: '2',
                      label: (
                        <Link to={`editProduct/${product._id}`}>
                          <p>Edit</p>
                        </Link>
                      ),
                    },
                  ];

                  return (
                    <div
                      key={product._id}
                      className={`flex flex-col sm:flex-row items-center p-4 gap-7 border-b-2 ${!product.isEnabled ? "opacity-[30%]" : ""
                        }`}
                    >
                      <Checkbox
                        className="w-5 h-5"
                        checked={selectedProducts.includes(product._id)}
                        onChange={(e) => handleCheckboxChange(product, e)}
                      />
                      <img
                        src={product?.productImages[0]}
                        className="max-w-16 max-h-16 object-cover rounded"
                      />
                      <p className="text-sm font-semibold flex-grow line-clamp-3 overflow-hidden text-ellipsis break-words">
                        {product?.productName}
                      </p>
                      <p className="text-pink-600 font-semibold">
                        ₹{product?.variation[0]?.sellingPrice}
                      </p>
                      <Dropdown menu={{ items }}>
                        <a className="cursor-pointer" onClick={(e) => e.preventDefault()}>
                          <Space>
                            <BsThreeDots size={25} />
                          </Space>
                        </a>
                      </Dropdown>
                    </div>
                  );
                })}

              </div> : <div className="border-t-2 p-5 grid grid-cols-1 2xl:grid-cols-2 gap-x-10 2xl:gap-x-20 gap-y-5 relative">
                {drafts.map((product) => {
                  const items = [
                    {
                      key: '2',
                      label: (
                        <Link to={`editProduct/${product._id}`}>
                          <p>Edit</p>
                        </Link>
                      ),
                    },
                  ];

                  return (
                    <div
                      key={product._id}
                      className={`flex flex-col sm:flex-row items-center p-4 gap-7 border-b-2 ${!product.isEnabled ? "opacity-[30%]" : ""
                        }`}
                    >
                      <Checkbox
                        className="w-5 h-5"
                        checked={selectedProducts.includes(product._id)}
                        onChange={(e) => handleCheckboxChange(product, e)}
                      />
                      <img
                        src={product?.productImages[0]}
                        className="max-w-16 max-h-16 object-cover rounded"
                      />
                      <p className="text-sm font-semibold flex-grow line-clamp-3 overflow-hidden text-ellipsis break-words">
                        {product?.productName}
                      </p>
                      {product?.variation[0]?.sellingPrice ?
                        <p className="text-pink-600 font-semibold">
                          ₹{product?.variation[0]?.sellingPrice}
                        </p> : ""}
                      <Dropdown menu={{ items }}>
                        <a className="cursor-pointer" onClick={(e) => e.preventDefault()}>
                          <Space>
                            <BsThreeDots size={25} />
                          </Space>
                        </a>
                      </Dropdown>
                    </div>
                  );
                })}</div>}
            <div className="absolute bottom-32 self-center flex  justify-center w-1/2">
              <ProductControlModal
                open={open}
                setOpen={setOpen}
                setSelectedProducts={setSelectedProducts}
                selectedCount={selectedProducts.length}
                selectedProducts={selectedProducts}
                setDeleteTrigger={setDeleteTrigger}
                setUpdateTrigger={setUpdateTrigger}
                allProducts={allProducts}
              />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default GetAllProduct;
