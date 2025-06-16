import Sidebar from "../../components/user/Sidebar";
import Navbar from "../../components/user/Navbar";
import { Toaster } from "react-hot-toast";
import Searchbox from "../../components/Helper/Searchbox";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import {
  setSortField,
  setSortOrder,
  showUser,
  setSelectedOption,
} from "../../features/productDetailSlice";
import { useEffect, useState, useRef, useCallback } from "react";
import GetOrderCards from "../../components/user/getOrderCards";
import { Dropdown } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

export default function GetAllOrder() {
  const dispatch = useDispatch();
  const {
    orders,
    currentPage,
    totalPages,
    searchData,
    sortOrder,
    sortField,
    selectedOption,
  } = useSelector((state) => state.app);

  const [flag, setFlag] = useState(false);

  // Set default searchBy on mount
  useEffect(() => {
    dispatch(setSelectedOption("productName"));
  }, [dispatch]);

  // Fetch initial data
  useEffect(() => {
    dispatch(
      showUser({
        search: searchData,
        searchBy: selectedOption,
        sortField,
        sortOrder,
        page: 1,
      })
    );
  }, [dispatch, searchData, selectedOption, sortField, sortOrder, flag]);

  const updateFilterValue = (key, value) => {
    if (key === "sortOrder") dispatch(setSortOrder(value));
    if (key === "sortField") dispatch(setSortField(value));
  };

  // Infinite scroll logic
  const observer = useRef();
  const lastOrderRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          currentPage < totalPages
        ) {
          dispatch(
            showUser({
              search: searchData,
              searchBy: selectedOption,
              sortField,
              sortOrder,
              page: currentPage + 1,
            })
          );
        }
      });
      if (node) observer.current.observe(node);
    },
    [dispatch, searchData, selectedOption, sortField, sortOrder, currentPage, totalPages]
  );

  const sortItems = [
    { label: "Order At", key: "orderAt_asc", icon: <ArrowUpOutlined /> },
    { label: "Order At", key: "orderAt_desc", icon: <ArrowDownOutlined /> },
    { label: "Deliver At", key: "deliverAt_asc", icon: <ArrowUpOutlined /> },
    { label: "Deliver At", key: "deliverAt_desc", icon: <ArrowDownOutlined /> },
  ];

  const selectedKey = `${sortField}_${sortOrder}`;

  return (
    <>
      <div className="lg:flex items-start">
        <div className="flex-grow">
          <Sidebar />
        </div>
        <div className="lg:flex lg:flex-col lg:w-full">
          <Navbar pageName="Orders" />
          <div className="h-[calc(100vh-100px)] bg-[#e3e0e0] p-4 overflow-scroll">
            <div className="flex justify-between items-center mb-4">
              <Searchbox />
              <div className="flex gap-4 justify-end">
                <Dropdown
                  menu={{
                    items: sortItems.map(({ key, label, icon }) => ({
                      key,
                      label: (
                        <span
                          onClick={() => {
                            updateFilterValue("sortField", key.split("_")[0]);
                            updateFilterValue("sortOrder", key.split("_")[1]);
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
                  <button className="flex items-center text-[#1A1A1A] bg-[#FFFFFF] border-0 py-2 px-6 focus:outline-none hover:bg-[#EC2F79] hover:text-white rounded-md text-lg w-full">
                    <HiMiniArrowsUpDown className="mr-2" color="#5D5D5D" />
                    Sort
                  </button>
                </Dropdown>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center md:flex-col">
              {orders && orders.length > 0 ? (
                orders.map((item, index) => {
                  const isLast = index === orders.length - 1;
                  return (
                    <div ref={isLast ? lastOrderRef : null} key={item._id}>
                      <GetOrderCards
                        address={item?.addressId}
                        price={item?.price}
                        quantity={item?.quantity}
                        amount={item?.amount}
                        productId={item.productId?._id}
                        productName={item.productId?.productName}
                        orderAt={item?.orderAt}
                        deliverAt={item?.deliverAt}
                        productImage={item.productId?.productImages[0]}
                        orderId={item?._id}
                        status={item?.status}
                        item={item}
                        paymentStatus={item.paymentId?.status}
                        flag={flag}
                        setFlag={setFlag}
                      />
                    </div>
                  );
                })
              ) : (
                <p className="text-center w-full text-gray-500 py-4">
                  No orders to display
                </p>
              )}
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
}

