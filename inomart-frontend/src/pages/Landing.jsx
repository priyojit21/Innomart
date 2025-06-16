import React from 'react'
import Navbar from '../components/Navbar'
import Carousel from '../components/Carousel'
import Hero from './User/Hero'
import PopularCategories from './User/PopularCategories'
import Banner from './User/Banner'
import Footer from '../components/Footer'
import { Toaster } from "react-hot-toast";

const Landing = () => {
  return (
    <>
      <Navbar></Navbar>
      <Carousel></Carousel>
      <Hero />
      <Banner />
      <PopularCategories />
      <Footer />
      <Toaster></Toaster>
    </>
  )
}

export default Landing