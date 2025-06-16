import React, { useEffect, useState } from 'react';
import OfferCards from './OfferCards';
import axiosInstance from '../../middleware/axiosInterceptor';
import AddnewCoupon from './AddnewCoupon';
import Sidebar from '../../components/Seller/Sidebar';
import Navbar from '../../components/Seller/Navbar';
import { Link } from 'react-router-dom';

export default function Offer() {
  const accessToken = localStorage.getItem("accessToken");
  const [coupons, setCoupons] = useState([]);
  const [deleteAddr, setDeleteAddr] = useState(false);

  const getAllCoupons = async () => {
    try {
      const res = await axiosInstance.get(
        "http://localhost:3000/product/getAllCoupon",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCoupons(res.data.coupons);
    } catch (error) {
      if (error.response.status === 404) {
        setCoupons([]);
      }
    }
  };

  useEffect(() => {
    getAllCoupons();
  }, [deleteAddr]);

  return (
    <div className="lg:flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="lg:flex-1 flex flex-col">
        <Navbar pageName="All Offers" />

        {/* Offer Cards Grid */}
        <div className=" bg-[#e3e0e0] p-5 overflow-auto grid gap-6 sm:grid-cols-1 xl:grid-cols-2 3xl:grid-cols-2  justify-center">
          {coupons.map((item, index) => (
            <OfferCards
              key={index}
              amount={item.amount}
              code={item.code}
              minAmount={item.minAmount}
              offerDetails={item.offerDetails}
              offerType={item.offerType}
              validFromDateTime={item.validFromDateTime}
              validTillDateTime={item.validTillDateTime}
              id={item._id}
              getAllCoupons={getAllCoupons}
              deleteAddr={deleteAddr}
              setDeleteAddr={setDeleteAddr}
            />
          ))}
          <Link to="/offers/addCoupon">
            <AddnewCoupon />
          </Link>
        </div>
      </div>
    </div>

  );
}
