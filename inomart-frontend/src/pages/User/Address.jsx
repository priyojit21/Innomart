import React, { useEffect, useState } from "react";
import Sidebar from "../../components/user/Sidebar";
import Navbar from "../../components/user/Navbar";
import edit from "../../assets/user/edit.svg";
import del from "../../assets/user/delete.svg";
import { IoAddOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Modal from "../../components/Helper/Modal";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../middleware/axiosInterceptor";

const Address = () => {
  const [defaultAddressId, setDefaultAddress] = useState("")
  const [address, setAddress] = useState([]);
  const [deleteAddr, setDeleteAddr] = useState(false);
  const [active, setActive] = useState(false);
  const [Id, setId] = useState("");

  const c = 0;

  const getAllAddress = async () => {
    try {
      const res = await axiosInstance.get("user/getAddress");
      setAddress(res.data.data);
      if (res.data.data.length > 0) {
        setDefaultAddress(res.data.data[0].userId.defaultAddressId)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const changeDefaultAddress = async (addressId) => {
    try {
      const res = await axiosInstance.post("user/makeDefaultAddress", { addressId });
      setDefaultAddress(res.data.defaultAddressId)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAllAddress();
  }, [deleteAddr]);

  return (
    <>
      <div className="lg:flex items-start">
        <div className="flex-grow">
          <Sidebar />
        </div>
        <div className="lg:flex lg:flex-col lg:w-full">
          <Navbar pageName="Addresses" />
          <div className="h-[calc(100vh-80px)] bg-[#e3e0e0] p-[20px] overflow-scroll flex justify-center">
            <div className="grid gap-6 xl:grid-cols-2 3xl:grid-cols-3 justify-center items-center xl:items-start h-fit">
              <Link to="/address/add">
                <div className="flex flex-col bg-[#ECECEC] justify-center items-center cursor-pointer sm:flex-row border-2 rounded-lg border-gray-200 p-5 w-full max-w-[530px] xl:p-14 h-full min-h-[250px] hover:bg-[#b8b6b6]">
                  <div className="flex gap-2 justify-center items-center">
                    <IoAddOutline size={18} strokeWidth={4} />
                    <p className="font-man font-bold text-base xl:text-[18px]">
                      Add New Address
                    </p>
                  </div>
                </div>
              </Link>
              {address.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="bg-[#FFFFFF] lg:w-[530px] h-fit pt-[25px] pl-[28px] pr-[25px] rounded-[10px]"
                  >
                    <div className="flex justify-between">
                      <p className="pt-[4px] mb-[18px] font-man font-bold">
                        {item.name}
                      </p>
                      <div className="w-[63px] pt-[4px] pb-[5px] text-center bg-[#E4E5FF] border-[#B3B5E7] border-[1px] text-[#2F36F4] rounded-[7px] text-[12px] font-man font-bold h-fit">
                        {item.type}
                      </div>
                    </div>
                    <p className="pb-[12px]">
                      {item.houseNo}, {item.street}, {item.state} ,
                      {item.country},{item.pinCode}
                    </p>
                    <p className="pb-[38px]">{item.landMark}</p>
                    <a href="tel:0123456789" className="font-semibold">
                      Ph: 0123456789
                    </a>
                    <div className="mt-[30px] flex justify-between mb-[25px] flex-wrap gap-4">
                      <div className="flex items-center cursor-pointer">
                        <input
                          name="default"
                          type="checkbox"
                          checked={item._id === defaultAddressId}
                          className="w-[25px] h-[25px] mr-[14px] rounded-[5px]"
                          onClick={() => changeDefaultAddress(item._id)}
                        />
                        <label htmlFor="default" className="text-[#707070]">
                          {" "}
                          Make default address{" "}
                        </label>
                      </div>
                      <div className="flex gap-[7px]">
                        <Link to={`/address/edit/${item._id}`}>
                          <div className="py-[7px] px-[18px] cursor-pointer flex gap-[2px] border-[#E4E4E4] hover:bg-[#FFEBF3] border-[1px] w-[90px] rounded-[10px]">
                            <img src={edit}></img>
                            <p className="text-[#979EAF]">Edit</p>
                          </div>
                        </Link>


                        <div
                          className="py-[7px] px-[18px] cursor-pointer flex gap-[2px] border-[#E4E4E4] border-[1px] w-[113px] hover:bg-[#FFEBF3] rounded-[10px]"
                          onClick={() => {
                            setActive(true), setId(item._id);
                          }}
                        >
                          <img src={del}></img>
                          <p className="text-[#979EAF]">Delete</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Modal
        active={active}
        setActive={setActive}
        Id={Id}
        setId={setId}
        deleteAddr={deleteAddr}
        setDeleteAddr={setDeleteAddr}
        c={c}
      />

      <Toaster />
    </>
  );
};

export default Address;
