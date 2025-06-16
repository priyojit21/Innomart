import React from 'react';
import circle from '../../assets/Hero/heroCircle.png';
import line from '../../assets/Hero/heroLine.svg';
import traingle from '../../assets/Hero/heroTriangle.png';
import semiCircle from '../../assets/Hero/herosemiCircle.png';
import ellipse from '../../assets/Hero/heroEllipse.png';
import zigzag from '../../assets/Hero/heroZigzag.svg';
import { useNavigate } from 'react-router-dom';

export default function Banner() {

    const navigate = useNavigate();
    const loginHandler = () => {
        navigate("/login")
    }

    return (
        // <div className='mt-10 relative bg-[#F4EAFF] max-w-[1170px] xl:mt-[130px] w-4/5 mx-auto' id="banner">
        <div className='mt-10 relative bg-[#ebe2f6] max-w-[1170px] xl:mt-[130px] w-4/5 mx-auto' id="banner">
            <div className='flex flex-col justify-center items-center p-6 md:p-12 lg:p-20 xl:p-[89px] text-center'>
                <h2 className='uppercase font-semibold text-[16px] w-[112%] sm:text-[18px] md:text-xl lg:text-2xl xl:text-[40px]'>
                    30% OFF for First Buyers Only!
                </h2>
                <p className='text-[#717171] w-[110x%] font-normal my-3 md:my-4 lg:my-[22px] text-sm md:text-base lg:text-lg xl:text-[20px]'>
                    Start from 1 till 20 September 2025
                </p>
                <button
                    type="button"
                    className="py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:py-4 rounded-lg text-sm md:text-base font-medium border-0 bg-[#FFBD17] 
             w-[120px] md:w-[130px] lg:w-[140px] xl:w-[152px] hover:bg-[#e3b541]"
                    onClick={loginHandler}
                >
                    Get it now
                </button>

            </div>
            <img src={circle} alt="circle" className='hidden md:block absolute md:bottom-0 md:left-[26px] lg:left-[32px] xl:left-[38px]' />
            <img src={line} alt="line" className='hidden md:block absolute md:top-[58px] md:left-[17px] lg:top-[70px] lg:left-[23px] xl:top-[77px] xl:left-[27px]' />
            <img src={traingle} alt="triangle" className='hidden md:block absolute md:bottom-[90px] md:left-[145px] lg:bottom-[100px] lg:left-[272px] xl:bottom-[107px] xl:left-[278px]' />
            <img src={semiCircle} alt="semiCircle" className='hidden md:block absolute md:top-0 md:right-[100px] lg:right-[230px] xl:right-[237px]' />
            <img src={ellipse} alt="ellipse" className='hidden md:block absolute md:top-[60px] md:right-[100px] lg:top-[88px] lg:right-[133px] xl:top-[94px] xl:right-[139px]' />
            <img src={zigzag} alt="zigzag" className='hidden md:block absolute md:bottom-[60px] md:right-[150px] lg:bottom-[75px] lg:right-[160px] xl:bottom-[81px] xl:right-[165px]' />
        </div >
    );
}

