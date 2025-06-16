import React, { useEffect, useState } from 'react'
import notification from './../../assets/seller/notification.svg'
import Support from './../../assets/seller/support.svg'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../middleware/axiosInterceptor'
import admin from './../../assets/seller/admin.svg';
import { Popconfirm } from 'antd';


const Navbar = ({ pageName, flag }) => {
  const fname = localStorage.getItem("userName");
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [profilePic, setprofilePic] = useState('');

  const getUser = async () => {
    try {
      const response = await axiosInstance.get("http://localhost:3000/user/getUser ", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setprofilePic(response.data.userProfile.details.profilePic)
    }
    catch (error) {
      console.log(error);
    };
  }

  useEffect(() => {
    getUser()
  }, [flag])

  return (
    <>
      <div>
        <h1 className='text-center pt-[10px] lg:hidden font-man text-[20px] font-semibold'>
          {pageName}
        </h1>
      </div>
      <div className='hidden text-[20px] font-man font-medium lg:flex justify-between w-full pt-[26px] px-[20px] pb-[26px] items-center h-fit  bg-white border-b border-[#EEEEEE]'>
        {pageName}
        <div className='flex gap-[54px] items-center'>
          <Popconfirm
            title="Coming Soon"
            description="This feature under development. Stay tuned!"
          >
            <img src={Support} className="cursor-pointer"></img>
          </Popconfirm>

          <Popconfirm
            title="Coming Soon"
            description="This feature under development. Stay tuned!"
          >
            <img src={notification} className="cursor-pointer" alt="" />
          </Popconfirm>

          <div className='flex items-center gap-[11px]'>
            <img src={profilePic ? profilePic : admin} alt="admin" className='w-[40px] h-[40px] rounded-full object-cover cursor-pointer' onClick={() => navigate("/sellerProfile")} ></img>
            <p>
              Hello! {fname.slice(0, 8)}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
