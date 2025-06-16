import React, {useEffect, useState } from 'react'
import Sidebar from '../../components/Seller/Sidebar'
import Navbar from '../../components/Seller/Navbar'
import revenue from '../../assets/seller/revenue.svg'
import order from '../../assets/seller/order.svg'
import pending from '../../assets/seller/pending.svg'
import cancelled from '../../assets/seller/cancelled.svg'
import completed from '../../assets/seller/completed.svg'
import comments from '../../assets/seller/comments.svg'
import rating from '../../assets/seller/rating.svg'
import box from '../../assets/seller/box.png'
import axiosInstance from "../../middleware/axiosInterceptor";
import { Select, Space } from 'antd';
import { Progress } from 'antd';
import LineChart from '../../components/Helper/LineChart'
import next from "../../assets/seller/next.svg"
import { useNavigate } from 'react-router-dom'
import { Rate } from 'antd';

export default function SellerHome() {
    const accessToken = localStorage.getItem("accessToken")
    const [sellerDetails, setSellerDetails] = useState({});
    const [inventory, setInventory] = useState({});
    const [sellerOrderDetails, setSellerOrderDetails] = useState({});
    const [topSell, setTopSell] = useState([])
    const [lowStocks, setLowStocks] = useState([])
    const [orderDropdown, setOrderDropdown] = useState("")
    const [topDropdown, setTopDropdown] = useState("")
    const [earnings, setEarnings] = useState(0);
    const [orders, setOrders] = useState(0);
    const [averageRating, setAverageRating] = useState(0)
    const [latestReviews, setLatestReviews] = useState([])
    const [option, setOption] = useState("topSelling");
    const navigate = useNavigate()

    const getSeller = async () => {
        try {
            const response = await axiosInstance.post("/order/revenue", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            if (response) {
                setSellerDetails(response.data)
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSeller()
        inventoryDetails()
        lowStock()
        avgRating()
        latestReview()
    }, [])

    const getSellerDetails = async () => {
        try {
            const data = {
                "timeRange": orderDropdown
            }
            const response = await axiosInstance.post("/order/revenue", data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            if (response) {
                setSellerOrderDetails(response.data)
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getSellerDetails()
    }, [orderDropdown])

    const formatRevenue = (value) => {
        if (value === null || value === undefined) return '0';

        const num = Number(value);
        if (isNaN(num)) return '0';
        if (num < 1000) return `${num.toLocaleString()}`;
        const units = ["K", "M", "B", "T"];
        const unitIndex = Math.floor(Math.log10(num) / 3) - 1;
        const unitValue = Math.pow(1000, unitIndex + 1);
        const shortNumber = (num / unitValue).toFixed(1).replace(/\.0$/, "");
        return `${shortNumber}${units[unitIndex]}`;
    }

    const handleChange = (value) => {
        setOrderDropdown(value)
    };

    const inventoryDetails = async () => {
        try {
            const response = await axiosInstance.get("/business/inventoryManagement", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            if (response) {
                setInventory(response.data)
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const topSelling = async () => {
        try {
            const data = {
                "timeRange": topDropdown
            }
            const response = await axiosInstance.post("/product/topSelling", data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            if (response) {
                setTopSell(response.data.topSellingProducts)
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const lowStock = async () => {
        try {
            const response = await axiosInstance.get("/product/lowStock", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            if (response) {
                setLowStocks(response.data.data)
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const avgRating = async () => {
        try {
            const response = await axiosInstance.get("/product/allReview", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            console.log("rating", response)
            if (response) {
                setAverageRating(response.data.averageSellerRating)
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const latestReview = async () => {
        try {
            const response = await axiosInstance.get("/product/getLatestReview", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            console.log("latest", response)
            if (response) {
                setLatestReviews(response.data.feedbacks)
            }
        }
        catch (error) {
            console.log(error);
        }
    }


    const handleChangeTop = (value) => {
        setTopDropdown(value)
        console.log("value", value)
    }
    useEffect(() => {
        topSelling()
    }, [topDropdown])
    return (
        <>
            <div className="lg:flex items-start">
                <div className="lg:flex items-start">
                    <div className="flex-grow">
                        <Sidebar />
                    </div>
                </div>
                <div className="lg:flex lg:flex-col lg:w-full">
                    <Navbar pageName="Seller Dashboard" />
                    <div className="h-[calc(100vh-100px)] bg-[#e3e0e0] p-[20px]  overflow-scroll font-man">
                        <div className='flex gap-[20px] flex-wrap'>
                            <div className='w-full 3xl:max-w-[315px]'>
                                <div className='bg-[#FFFFFF] p-[20px] relative rounded-[20px] mb-[10px]'>
                                    <p className='text-[30px] mb-[38px]'>
                                        ₹{formatRevenue(sellerDetails.totalRevenue)}
                                    </p>
                                    <img src={revenue} className='absolute top-0 right-0'>
                                    </img>
                                    <p className='font-medium text-[#707070]'>
                                        Total revenue earned
                                    </p>
                                </div>
                                <div className='bg-[#FFFFFF] p-[20px] relative rounded-[20px] mb-[24px]'>
                                    <p className='text-[30px] mb-[38px]'>
                                        {formatRevenue(sellerDetails.totalOrders)}
                                    </p>
                                    <img src={order} className='absolute top-0 right-0'>
                                    </img>
                                    <p className='font-medium text-[#707070]'>
                                        Number of orders received
                                    </p>
                                </div>
                                <div className=''>
                                    <div className='flex justify-between items-center'>
                                        <p className='text-[20px] font-semibold'>Orders</p>
                                        <Space wrap>
                                            <Select
                                                defaultValue="OverAll"
                                                style={{
                                                    width: 106,
                                                    height: 40,
                                                    "color": "#707070"
                                                }}
                                                onChange={handleChange}
                                                options={[
                                                    { value: 'daily', label: 'Daily' },
                                                    { value: 'weekly', label: 'Weekly' },
                                                    { value: 'monthly', label: 'Monthly' },
                                                    { value: '', label: 'OverAll' },
                                                ]}
                                            />
                                        </Space>
                                    </div>
                                    <div className='p-[25px] bg-[#FFFFFF] mt-[14px] rounded-[20px] flex items-center justify-between'>
                                        <div className='flex gap-[21px]'>
                                            <img src={pending}></img>
                                            <p className='text-[30px] font-semibold'>
                                                {formatRevenue(sellerOrderDetails.pending)}
                                            </p>
                                        </div>
                                        <p>
                                            Pending Orders
                                        </p>
                                    </div>
                                    <div className='p-[25px] bg-[#FFFFFF] mt-[14px] rounded-[20px] flex items-center justify-between'>
                                        <div className='flex gap-[21px]'>
                                            <img src={completed}></img>
                                            <p className='text-[30px] font-semibold'>
                                                {formatRevenue(sellerOrderDetails.completed)}
                                            </p>
                                        </div>
                                        <p>
                                            Completed Orders
                                        </p>
                                    </div>
                                    <div className='p-[25px] bg-[#FFFFFF] mt-[14px] rounded-[20px] flex items-center justify-between'>
                                        <div className='flex gap-[21px]'>
                                            <img src={cancelled}></img>
                                            <p className='text-[30px] font-semibold'>
                                                {formatRevenue(sellerOrderDetails.cancelled)}
                                            </p>
                                        </div>
                                        <p>
                                            Cancelled Orders
                                        </p>
                                    </div>
                                </div>
                                <div className='mt-[24px]'>
                                    <div className='flex justify-between items-center mb-[14px]'>
                                        <p className='text-[20px] font-semibold'>Customer Eng...</p>
                                        <Space wrap>
                                            <Select
                                                defaultValue="OverAll"
                                                style={{
                                                    width: 106,
                                                    height: 40,
                                                    "color": "#707070"
                                                }}
                                                options={[
                                                    { value: 'daily', label: 'Daily' },
                                                    { value: 'weekly', label: 'Weekly' },
                                                    { value: 'monthly', label: 'Monthly' },
                                                    { value: '', label: 'OverAll' },
                                                ]}
                                            />
                                        </Space>
                                    </div>
                                    <div className='flex flex-wrap justify-center gap-[13px] '>
                                        <div className='w-[150px] p-[25px] bg-[#FFFFFF] rounded-[20px]'>
                                            <img src={comments} className='mb-[16px]'>
                                            </img>
                                            <p className='text-[30px] mb-[13px]'>
                                                296
                                            </p>
                                            <p className='font-medium text-[#707070]'>
                                                Unread Messages
                                            </p>
                                        </div>
                                        <div className='w-[150px] p-[25px] bg-[#FFFFFF] rounded-[20px]'>
                                            <img src={rating} className='mb-[24px]'>
                                            </img>
                                            <p className='text-[30px] mb-[13px]'>
                                                {averageRating}
                                            </p>
                                            <p className='font-medium text-[#707070]'>
                                                Average Rating
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='3xl:max-w-[847px] w-full flex flex-col gap-[19px] flex-grow'>
                                <LineChart
                                    earnings={earnings}
                                    setEarnings={setEarnings}
                                    orders={orders}
                                    setOrders={setOrders}
                                />
                                <div className='bg-[#FFFFFF] p-[17px] lg:p-[31px] rounded-[20px] overflow-x-scroll overflow-y-hidden h-[515px] '>
                                    <div className='flex justify-between flex-wrap gap-2'>
                                        <div className='flex gap-[13px]'>
                                            <div
                                                onClick={() => setOption('topSelling')}
                                                className={`min-w-[114px] px-[20px] py-[10px] text-[14px] rounded-[10px] cursor-pointer ${option === 'topSelling' ? 'bg-[#EC2F79] text-white' : 'bg-[#F1F1F1]'
                                                    }`}
                                            >
                                                Top Selling
                                            </div>
                                            <div
                                                onClick={() => setOption('lowStock')}
                                                className={`min-w-[114px] px-[20px] py-[10px] text-[14px] rounded-[10px] cursor-pointer ${option === 'lowStock' ? 'bg-[#EC2F79] text-white' : 'bg-[#F1F1F1]'
                                                    }`}
                                            >
                                                Low Stock
                                            </div>
                                        </div>

                                        {option === "topSelling" && (
                                            <Space wrap>
                                                <Select
                                                    defaultValue=""
                                                    style={{ width: 106, height: 40, color: "#707070" }}
                                                    onChange={handleChangeTop}
                                                    options={[
                                                        { value: 'daily', label: 'Daily' },
                                                        { value: 'weekly', label: 'Weekly' },
                                                        { value: 'monthly', label: 'Monthly' },
                                                        { value: '', label: 'OverAll' },
                                                    ]}
                                                />
                                            </Space>
                                        )}
                                    </div>

                                    {option === "topSelling" ? (
                                        <>
                                            {topSell.length > 0 ? (
                                                <>

                                                    <div className="flex gap-[27px] items-center p-[9px] font-semibold text-[#707070] border-b border-[#E5E5E5]">
                                                        <div className="w-[44px]"></div>
                                                        <div className="w-[378px] hidden lg:block "></div>
                                                        <div className="w-[100px] text-[#707070]">Price</div>
                                                        <div className="w-[100px] text-[#707070]">Sold</div>
                                                    </div>

                                                    <div className='h-[350px] overflow-y-scroll'>
                                                        {topSell.map((item, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex gap-[27px] items-center p-[13px] text-[#707070] border-b border-[#E5E5E5]"
                                                            >
                                                                <div className="w-[44px] h-[44px] overflow-hidden rounded">
                                                                    <img
                                                                        src={item.productImage}
                                                                        alt={item.productName}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="hidden lg:block text-[16px] font-medium w-[378px] truncate">
                                                                    {item.productName}
                                                                </div>
                                                                <div className="text-[#EC2F79] font-bold w-[100px]">
                                                                    ₹{item.sellingPrice}
                                                                </div>
                                                                <div className="text-[#0C0C0C] font-bold w-[100px]">
                                                                    {item.orderCount}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center text-[#707070] py-[20px] font-medium">
                                                    No products sold
                                                </div>
                                            )}
                                        </>
                                    ) : <>
                                        {lowStocks.length > 0 ? (
                                            <>

                                                <div className="flex gap-[27px] items-center p-[9px] font-semibold text-[#707070] border-b border-[#E5E5E5]">
                                                    <div className="w-[44px]"></div>
                                                    <div className="w-[378px]"></div>
                                                    <div className="w-[100px] text-[#707070]">Stock</div>
                                                </div>


                                                {lowStocks.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex gap-[27px] items-center p-[13px] text-[#707070] border-b border-[#E5E5E5]"
                                                    >
                                                        <div className="w-[44px] h-[44px] overflow-hidden rounded">
                                                            <img
                                                                src={item.productImage}
                                                                alt={item.productName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="text-[16px] font-medium w-[378px] truncate">
                                                            {item.productName}
                                                        </div>
                                                        <div className="text-[#EC2F79] font-bold w-[100px]">
                                                            {item.stock}
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="text-center text-[#707070] py-[20px] font-medium">
                                                No Low Stock Products
                                            </div>
                                        )}
                                    </>}


                                </div>
                            </div>
                            <div className='w-full 3xl:max-w-[428px] flex justify-center mt-[30px] xl:mt-[0px]'>
                                <div className='w-full 3xl:max-w-[428px] flex flex-col'>
                                    {/* Inventory Status */}
                                    <div className='pt-[20px] pl-[23px] pr-[19px] bg-[#FFFFFF] h-fit rounded-[20px]'>
                                        <p className='text-[20px] font-semibold mb-[28px]'>Inventory Status</p>
                                        <div className='w-full  3xl:w-[386px] bg-[#FFEBF4] flex justify-between pt-[23px] pl-[37px] rounded-[20px] mb-[47px]'>
                                            <div>
                                                <p className='text-[30px]'>{inventory.totalStock}</p>
                                                <p className='text-[#707070]'>Stocks</p>
                                            </div>
                                            <img src={box} width={100} />
                                        </div>
                                        <div className='flex justify-between'>
                                            <div>
                                                <p className='text-[30px] mb-[10px] mt-[-10px]'>{inventory.inStock}</p>
                                                <p className='text-[#707070]'>In Stock</p>
                                            </div>
                                            <div className='flex flex-col '>
                                                <Progress percent={(inventory.inStock / inventory.totalProduct) * 100} steps={26} size="small" />
                                                <p className='text-[#707070] mt-[24px]'>/{inventory.totalProduct}</p>
                                            </div>
                                        </div>
                                        <div className='flex justify-between mt-[35px] pb-[43px]'>
                                            <div>
                                                <p className='text-[30px] mb-[10px] mt-[-10px]'>{inventory.lowStock}</p>
                                                <p className='text-[#707070]'>Low Stock</p>
                                            </div>
                                            <div className='flex flex-col'>
                                                <Progress percent={(inventory.lowStock / inventory.totalProduct) * 100} steps={26} size="small" />
                                                <p className='text-[#707070] mt-[24px]'>/{inventory.totalProduct}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Latest Reviews */}
                                    <div className='p-[10px] lg:p-[20px] bg-[#FFFFFF] mt-[18px] rounded-[20px] text-[#0C0C0C] text-[20px]'>
                                        <div className='flex justify-between mb-[26px]'>
                                            <div className='text-[20px] font-semibold'>Latest Reviews</div>
                                            <div className='flex gap-[10px]'>
                                                <div className='text-[#EC2F79]'>View all</div>
                                                <img
                                                    src={next}
                                                    className='cursor-pointer'
                                                    onClick={() => navigate('/review')}
                                                />
                                            </div>
                                        </div>
                                        <div className='lg:h-[420px] overflow-y-scroll'>
                                            {latestReviews.slice(0, 3).map((latest, index) => (
                                                <div key={index} className='border-b border-[#E5E5E5] mb-[23px]'>
                                                    <div className='flex flex-col justify-center md:flex-row items-center md:justify-between mb-[13px] gap-2'>
                                                        <div className='flex items-center'>
                                                            <p className='lg:pr-[13px] text-[#707070]'>
                                                                {latest.userName.slice(0, 8)}
                                                            </p>
                                                            <Rate allowHalf disabled defaultValue={latest.rating} />
                                                            <p className='lg:pr-[43px]'>{latest.rating}</p>
                                                        </div>
                                                        <p className='text-[#707070]'>
                                                            {new Date(latest.date).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </p>
                                                    </div>
                                                    <p className='text-center truncate pb-[18px] text-[#707070] md:text-left'>
                                                        {latest.review}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

