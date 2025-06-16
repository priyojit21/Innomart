import React from "react";
import LogoIcon from "./../assets/innomartLogo.svg";

const Logo = () => {
  return (
    <div className="flex items-center">
      <img src={LogoIcon} className="w-[48.46px] h-[46.04px]" />
      <h1 className="m-[0.813vw] font-rob font-[500] text-2xl lg:text-[1.639vw]">
        Inno<span className="font-[400]">Mart</span>
      </h1>
    </div>
  );
};

export default Logo;
