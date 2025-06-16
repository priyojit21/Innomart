import React, { useEffect, useState } from 'react';
import axiosInstance from '../../middleware/axiosInterceptor';

export default function PopularCategories() {
    const [topSelling, setTopSelling] = useState([]);
    const overallTopSelling = async () => {
        try {
            const response = await axiosInstance.get("http://localhost:3000/product/overAllTopSelling");
            console.log("top", response);
            setTopSelling(response.data.topSellingProducts)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        overallTopSelling();
    }, [])

    return (
        <div className='mt-10 xl:mt-[130px]'>
            <h1 className='text-center font-semibold text-lg md:text-xl'>Popular Categories</h1>
            <div className='max-w-[1170px] w-4/5 mt-5 mx-auto grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5 lg:gap-6 xl:grid-cols-6 xl:gap-8 '>
                {topSelling.map((item, index) => (
                    <div>
                        < img
                            key={index}
                            src={item.productImage}
                            alt='Boots'
                            className='mt-5 w-[140px] h-[140px] object-cover mx-auto cursor-pointer transition-transform duration-300 transform scale-100 hover:scale-105 xl:mt-10 rounded-md'
                        />
                        <p className='mt-2 font-man font-semibold text-center'>{item.productName}</p>
                    </div>

                ))}
            </div>
        </div>
    );
}

