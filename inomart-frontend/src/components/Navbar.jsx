import React, { useState } from "react";
import Logo from "./Logo";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { HashLink as Link } from "react-router-hash-link";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const handleNav = () => {
    setNav(!nav);
  };

  const navItems = [
    { id: 1, text: "Home", to: "#home" },
    { id: 2, text: "What's New", to: "#hero" },
    { id: 3, text: "Deals", to: "#banner" },
    { id: 4, text: "Contact", to: "#footer" },
    { id: 5, text: "Login", to: "/login", isButton: true }
  ];

  return (
    <div className="flex justify-between items-center h-20 px-[30px] sm:px-[50px] 2xl:pl-[100px] 2xl:pr-[58px] text-black">
      <Logo />

      {/* for desktop */}
      <ul className="hidden md:flex items-center">
        {navItems.map((item) => (
          <li key={item.id} className="p-4 md:p-2 lg:p-4 xl:px-[35px]">
            {item.isButton ? (
              <Link to={item.to} smooth>
                {/* login Button */}
                <button className="text-[#382D13] px-[42px] py-[16px] rounded-[40px] bg-[#FFBD17] hover:bg-[#FF9F00]">
                  {item.text}
                </button>
              </Link>
            ) : (
              <Link to={item.to} smooth>
                <div className="animated-underline">
                  {item.text}
                </div>
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* for mobile */}
      <ul
        className={
          nav
            ? "z-10 absolute md:hidden pr-[50px] right-0 top-[96px] w-[62%] max-w-[240px] sm:w-[37%] rounded-b-md bg-white ease-in-out duration-500 flex flex-col items-start"
            : "z-10 ease-in-out w-[62%] max-w-[240px] sm:w-[37%] duration-1000 fixed top-[96px] right-[-100%] flex flex-col items-start"
        }
      >
        {navItems.map((item) => (
          <li key={item.id} className="p-3 sm:p-4 rounded-xl text-black cursor-pointer">
            {item.isButton ? (
              <Link
                to={item.to}
                smooth
                onClick={() => setNav(false)}
              >
                <button className="text-[#382D13] px-[32px] sm:px-[42px] py-[12px] sm:py-[16px] rounded-[40px] bg-[#FFBD17] hover:bg-[#FF9F00]">
                  {item.text}
                </button>
              </Link>
            ) : (
              <Link to={item.to} smooth onClick={() => setNav(false)}>
                <div className="animated-underline">
                  {item.text}
                </div>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
