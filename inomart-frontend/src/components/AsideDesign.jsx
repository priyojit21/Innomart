import React from 'react'
import home from '../assets/home.jpg'

export default function AsideDesign() {
  return (
    <section className='font-man bg-[#E8EEE3] hidden lg:block h-full overflow-hidden'>
      <div className='pt-[4vw] pl-[3vw] md:pt-[5.476vw] md:pl-[6.023vw] md:pr-[6.502vw]'>
        <h1 className='text-3xl xl:text-[2.738vw] font-semibold mb-[1.5rem] md:w-[37.509vw] leading-tight md:leading-[1.2]'>
          E-Commerce Dashboard to Manage Orders, Products, and Sales Efficiently.
        </h1>
        <h4 className='text-lg md:text-base/1 text-[#60635E] md:w-[27.584vw] md:text-[1.369vw] md:mb-[5.407vw] leading-relaxed md:leading-[1.6]'>
          Manage orders, track sales, and grow your e-commerce business easily.
        </h4>
      </div>
      <div className='rounded-5xl md:ml-[6.023vw] relative h-full'>
        <img src={home} alt="" className="absolute right-0 rounded-tl-xl" />
      </div>
    </section>
  )
}
