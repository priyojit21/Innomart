import React, { useEffect, useState } from 'react'
import hoodies from '../../assets/Hero/hoodies.png';
import sidebag from '../../assets/Hero/sideBag.png';
import smartwatch from '../../assets/Hero/smartwatch.png';
import { useNavigate } from 'react-router-dom';

export default function Hero() {

    const navigate = useNavigate();
    const loginHandler = () => {
        navigate("/login")
    }

    return (
        <>
            <div className='mt-10 flex flex-col items-center xl:mt-[130px]' id='hero'>
                <h1 className='text-center font-semibold text-lg lg:text-[20px]'>Top Selling Product</h1>
                <div className='max-w-[1170px] flex flex-col items-center'>
                    <div className='mt-5 flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-[20px] lg:gap-[25px] xl:gap-[30px]'>
                        <div className='cursor-pointer transition-transform duration-300 transform scale-100 hover:scale-105 border-2 border-grey-500 rounded-xl '>
                            <img
                                src={hoodies}
                                alt="HoodieImage"
                                className='w-4/5 mx-auto md:w-[320px] lg:max-w-[570px] lg:w-[415px] xl:w-[570px]'
                                onClick={loginHandler}
                            />
                        </div>
                        <div className='flex flex-col items-center md:mt-0 gap-[15px] xl:gap-[30px] w-4/5 mx-auto md:w-[320px] lg:max-w-[570px] lg:w-[415px] xl:w-full'>
                            <div className='grid grid-cols-2 gap-[15px] xl:gap-[30px] '>
                                <img
                                    src={sidebag}
                                    alt="bagImage"
                                    className='cursor-pointer transition-transform duration-300 transform scale-100 hover:scale-105 border-2 border-grey-500 rounded-xl'
                                    onClick={loginHandler}
                                />
                                <img
                                    src={sidebag}
                                    alt="bagImage"
                                    className='cursor-pointer transition-transform duration-300 transform scale-100 hover:scale-105 border-2 border-grey-500 rounded-xl'
                                    onClick={loginHandler}
                                />
                            </div>
                            <img
                                src={smartwatch}
                                className='w-full cursor-pointer transition-transform duration-300 transform scale-100 hover:scale-105 border-2 border-grey-500 rounded-xl'
                                alt="smartWatch"
                                onClick={loginHandler}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}


