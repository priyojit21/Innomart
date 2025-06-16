import Sidebar from "../../components/Seller/Sidebar";
import React from 'react'
import Navbar from '../../components/Navbar'

export default function SellerAnalytics() {
    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen">
            <div className="lg:w-[17%] w-full bg-white lg:h-full">
                <Sidebar />
            </div>

            <div className="lg:w-[85%] w-full flex flex-col">
                <Navbar pageName="Order Management" />
         
                <div>
                    hI
                </div>
            </div>
        </div>
    )
}
