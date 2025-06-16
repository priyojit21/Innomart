import React from "react";
import girlWithBags from "../assets/girlWithBags.png";
import northEastArrow from "../assets/northEastArrow.svg";

import { Link } from "react-router-dom";

const Girl = () => {
  return (
    <div className="bg-[#F7B7D0] w-[218px] pt-[16px] rounded-[20px] ">
      <div className="flex  justify-evenly items-center ">
        <p className="text-[#85234A] font-bold w-[56.5%]">Online Marketplace</p>
        <Link className="bg-[#EC2F79] w-[35px] h-[35px] flex items-center justify-center rounded-[10px] cursor-pointer" to={"/login"}>
          <img src={northEastArrow} alt="northEastArrow "className="rounded-[10px]"   />
        </Link> 
      </div>

      <img src={girlWithBags} alt="girlWIthBags" className="rounded-br-[20px]"/>
    </div>
    
  );
  
};

export default Girl;
