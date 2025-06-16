import React, { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import Logo from "../Logo";
import { NavLink } from "react-router-dom";
import home from "../../assets/seller/home.svg";
import products from "../../assets/seller/products.svg";
import orders from "../../assets/seller/orders.svg";
import review from "../../assets/seller/review.svg";
import offers from "../../assets/seller/offers.svg";
import Support from "./../../assets/seller/support.svg";
import Girl from "../Girl.jsx";
import logout from "../../assets/Sidebar/logout.png";
import notification from "./../../assets/seller/notification.svg";
import axiosInstance from "../../middleware/axiosInterceptor.js";
import LogOutModal from "../Helper/LogoutModal.jsx";

const Sidebar = () => {
  const [toggle, setToggleOpen] = useState(false);
  const [profilePic, setprofilePic] = useState("");
  const role = localStorage.getItem("role");
  const accessToken = localStorage.getItem("accessToken");
  const [active, setActive] = useState(false);

  const handleToggle = () => {
    setToggleOpen(!toggle);
  };

  const handleLogoutClick = () => {
    setActive(true);
  };

  const menuItems = [
    { to: "/sellerHome", label: "Home", icon: home },
    { to: "/product/seller", label: "Product", icon: products },
    { to: "/orders", label: "Orders", icon: orders },
    { to: "/review", label: "Review", icon: review },
    { to: "/offers", label: "Offers", icon: offers },
    {
      action: "logout",
      label: "Logout",
      icon: logout,
    },
  ];

  const getUser = async () => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:3000/user/getUser ",
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

  return (
    <>
      <div className="pt-[10px] lg:hidden">
        {toggle ? (
          <div className="absolute bg-white h-[calc(100vh-10px)] p-[10px] shadow-lg w-[275px] z-50">
            <div className="absolute right-2 top-3">
              <RxCross1 size={27} onClick={handleToggle} />
            </div>
            <div className="absolute left-2 top-0">
              <Logo />
            </div>
            <ul className="font-man flex flex-col gap-6 mt-16">
              {menuItems.map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex rounded-md gap-4 p-3 ${isActive ? "text-[#EC2F79] bg-[#FFEBF3]" : "text-black"
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
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <img src={Support} alt="Support" />
            </div>
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

      <div className="hidden lg:flex flex-col w-[250px] h-screen bg-white border-r border-[#EEEEEE] pt-[20px] pb-[26px] justify-between">
        <div>
          <div className="flex ml-[39px] mb-8">
            <Logo />
          </div>
          <ul className="font-man flex flex-col gap-[10px] w-[218px] mx-auto">
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
                      `flex gap-[13px] py-3 pl-[30px] rounded-md ${isActive ? "text-[#EC2F79] bg-[#FFEBF3]" : "text-black"
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
      <div className="absolute top-[18px] right-[10px] flex items-center gap-4 lg:hidden">
        <img
          src={notification}
          className="h-[27px] mt-[3px]"
          alt="Notification"
        />
        <img
          src={profilePic}
          className="cursor-pointer w-[40px] h-[40px] rounded-full object-cover"
          alt="Admin"
        />
      </div>
    </>
  );
};

export default Sidebar;
