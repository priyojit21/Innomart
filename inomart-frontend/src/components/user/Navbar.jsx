import React, { useEffect, useState } from 'react';
import admin from './../../assets/seller/admin.svg';
import notification from './../../assets/seller/notification.svg';
import cart from './../../assets/user/cart.svg';
import Cart from '../Helper/Cart';
import { useDispatch, useSelector } from 'react-redux';
import { handleCartItems } from '../../features/productDetailSlice';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../middleware/axiosInterceptor';
import { Popconfirm } from 'antd';

const Navbar = ({ pageName, flag }) => {
  const fname = localStorage.getItem("userName") || "User";
  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const productCount = useSelector((state) => state.app.productCount);
  const product = useSelector((state) => state.app.items);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [profilePic, setprofilePic] = useState('');

  const role = localStorage.getItem("role");
  const accessToken = localStorage.getItem("accessToken");


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


  const fetchCart = () => {
    setIsSidebarOpen(true);
    dispatch(handleCartItems());
  };

  useEffect(() => {
    dispatch(handleCartItems());
  }, [])


  useEffect(() => {
    getUser();
  }, [flag])



  return (
    <>
      <div>
        <h1 className='text-center pt-[10px] lg:hidden font-man text-[20px] font-semibold'>
          {pageName}
        </h1>
      </div>

      <div className='hidden text-[20px] font-man font-medium lg:flex justify-between w-full pt-[26px] px-[20px] pb-[26px] items-center h-fit bg-white border-b border-[#EEEEEE]'>
        {pageName}
        <div className='flex gap-[54px] items-center'>
          <Popconfirm
            title="Coming Soon"
            description="This feature under development. Stay tuned!"
          >
            <img src={notification} alt="notification" className='cursor-pointer' />
          </Popconfirm>

          <div className='relative cursor-pointer' onClick={fetchCart}>
            <img src={cart} alt="cart" />
            {productCount > 0 && (
              <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                {productCount}
              </span>
            )}
          </div>


          <div className='flex items-center gap-[11px]' >
            <Link to="/profile">
              <img src={profilePic ? profilePic : admin} alt="admin" className='w-[40px] h-[40px] rounded-full object-cover' />
            </Link>
            <p>Hello! {fname.slice(0, 8)}</p>
          </div>

        </div>
      </div>

      {isSidebarOpen && (
        <Cart
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          product={product}
          handleCartItems={fetchCart}
        />
      )}
    </>
  );
};

export default Navbar;
