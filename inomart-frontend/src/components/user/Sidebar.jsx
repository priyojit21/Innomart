import React, { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import Logo from "../Logo";
import Girl from "../Girl.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import orders from "../../assets/seller/orders.svg";
import products from "../../assets/seller/products.svg";
import address from "../../assets/user/address.svg";
import wishlist from "../../assets/user/wishlist.svg";
import profile from "../../assets/user/profile.svg";
import logout from "../../assets/Sidebar/logout.png";
import { useDispatch, useSelector } from "react-redux";
import { handleCartItems } from "../../features/productDetailSlice.js";
import Cart from "../Helper/Cart.jsx";
import axiosInstance from "../../middleware/axiosInterceptor.js";
import LogOutModal from "../Helper/LogoutModal.jsx";

const Sidebar = () => {
  const [toggle, setToggleOpen] = useState(false);
  const [profilePic, setprofilePic] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [active, setActive] = useState(false);
  const product = useSelector((state) => state.app.items);
  const dispatch = useDispatch();
  const productCount = useSelector((state) => state.app.productCount);

  const accessToken = localStorage.getItem("accessToken");

  const handleToggle = () => {
    setToggleOpen(!toggle);
  };

  const fetchCart = () => {
    setIsSidebarOpen(true);
    dispatch(handleCartItems());
  };

  useEffect(() => {
    dispatch(handleCartItems());
  }, []);

  const getUser = async () => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:3000/user/getUser",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setprofilePic(response.data.userProfile.details.profilePic);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleLogoutClick = () => {
    setActive(true);
  };

  const menuItems = [
    { to: "/orders/customer", label: "Orders", icon: orders },
    { to: "/product/customer", label: "Product", icon: products },
    { to: "/address", label: "Address", icon: address },
    { to: "/wishlist", label: "Wishlist", icon: wishlist },
    { to: "/profile", label: "Profile", icon: profile },
    {
      action: "logout",
      label: "Logout",
      icon: logout,
    },
  ];

  return (
    <>
      <div className="pt-[10px] lg:hidden">
        {toggle ? (
          <div className="absolute bg-white h-[calc(100vh-10px)] p-[10px] shadow-lg w-[275px] z-40">
            <div className="absolute right-2 top-3">
              <RxCross1 size={27} onClick={handleToggle} />
            </div>
            <div className="absolute left-2 top-0">
              <Logo />
            </div>
            <ul className="font-man flex flex-col gap-6 mt-16">
              {menuItems.map(({ to, label, icon, action }) => (
                <li key={label}>
                  {action === "logout" ? (
                    <button
                      onClick={handleLogoutClick}
                      className="flex rounded-md gap-4 p-3 text-black "
                    >
                      <img src={icon} className="w-6 h-6" alt={label} />
                      <p>{label}</p>
                    </button>
                  ) : (
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `flex rounded-md gap-4 p-3 ${isActive ? "text-[#EC2F79]  bg-[#f0cddb]" : "text-black"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <img
                            src={icon}
                            className="w-6 h-6"
                            alt={label}
                            style={{
                              filter: isActive
                                ? "brightness(0) saturate(100%) invert(27%) sepia(69%) saturate(3043%) hue-rotate(320deg) brightness(96%) contrast(92%)"
                                : "none",
                            }}
                          />
                          <p>{label}</p>
                        </>
                      )}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="pl-[10px] flex items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
              <CiMenuFries size={25} onClick={handleToggle} />
              {!toggle && <Logo />}
            </div>
          </div>
        )}
      </div>

      <div className="hidden lg:flex flex-col w-[250px] h-screen bg-white border-r border-[#EEEEEE] pt-[33px] pb-[26px] justify-between ">
        <div>
          <div className="flex ml-[39px] mb-8">
            <Logo />
          </div>
          <ul className="font-man flex flex-col gap-[10px] w-[218px] mx-auto ">
            {menuItems.map(({ to, label, icon, action }) => (
              <li key={label}>
                {action === "logout" ? (
                  <button
                    onClick={handleLogoutClick}
                    className="flex gap-[13px] py-3 pl-[30px] rounded-md text-black"
                  >
                    <img src={icon} className="w-6 h-6" alt={label} />
                    <p>{label}</p>
                  </button>
                ) : (
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex gap-[13px] py-3 pl-[30px] rounded-md ${isActive ? "text-[#EC2F79] bg-[#f0cddb]" : "text-black"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <img
                          src={icon}
                          className="w-6 h-6"
                          alt={label}
                          style={{
                            filter: isActive
                              ? "brightness(0) saturate(100%) invert(27%) sepia(69%) saturate(3043%) hue-rotate(320deg) brightness(96%) contrast(92%)"
                              : "none",
                          }}
                        />
                        <p>{label}</p>
                      </>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 mx-auto">
          <Girl />
        </div>
        <LogOutModal active={active} setActive={setActive} />
      </div>
    </>
  );
};

export default Sidebar;
