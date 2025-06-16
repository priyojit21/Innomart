import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import girl1 from "../assets/Hero/girl1.jpeg";
import girl2 from "../assets/Hero/girl2.jpeg";
import girl3 from "../assets/Hero/girl3.jpeg";
import girl7 from "../assets/Hero/girl7.jpg";
import girl6 from "../assets/Hero/girl6.jpg";
import girl from "../assets/hero/girl.jpg";
import newGirl from "../assets/hero/newGirl.jpg";
import axiosInstance from "../middleware/axiosInterceptor";

const Carousel = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("right-to-left");
  const [promotionalTexts, setPromotionalTexts] = useState([]);
  const autoAdvanceTime = 3000;

  const promoImages = [newGirl, girl7, girl2, girl6];

  const imagesSmall = [girl, girl1, girl3];

  const buildImagesLarge = (texts) => {
    return promoImages.map((img, index) => ({
      src: img,
      name: texts[index] || "Exciting Offer",
    }));
  };
  const buildImagesSmall = (texts) => {
    return imagesSmall.map((img, index) => ({
      src: img,
      name: texts[index] || "Special Deal",
    }));
  };

  const getAllInnomartCoupons = async () => {
    try {
      const res = await axiosInstance.get(
        "http://localhost:3000/product/getInnomartCoupons"
      );
      const texts = res.data.promotionalTexts || [];
      setPromotionalTexts(texts);

      const imageSet =
        window.innerWidth < 1024
          ? buildImagesSmall(texts)
          : buildImagesLarge(texts);

      setImages(imageSet);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setPromotionalTexts([]);
      const fallbackImages = window.innerWidth < 1024 ? buildImagesSmall([]) : buildImagesLarge([]);
      setImages(fallbackImages);
    }
  };


  const updateImages = () => {
    const imageSet =
      window.innerWidth < 1024
        ? buildImagesSmall(promotionalTexts)
        : buildImagesLarge(promotionalTexts);
    setImages(imageSet);
  };


  const goToNext = () => {
    setSlideDirection("right-to-left");
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const navigateTo = (index) => {
    if (index === currentIndex) return;
    setSlideDirection(index > currentIndex ? "right-to-left" : "left-to-right");
    setCurrentIndex(index);
  };

  useEffect(() => {
    getAllInnomartCoupons();
  }, []);

  useEffect(() => {
    updateImages();
    window.addEventListener("resize", updateImages);
    const interval = setInterval(goToNext, autoAdvanceTime);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", updateImages);
    };
  }, [promotionalTexts]);

  return (
    <div className="overflow-hidden" id="home">
      <div className="relative w-full h-[calc(100vh-200px)] md:h-[calc(100vh-130px)] lg:h-[calc(100vh-150px)] xl:h-[calc(100vh-80px)] 2xl:h-[calc(100vh-280px)] overflow-hidden">
        {images.length > 0 && (
          <div
            className="w-auto h-full bg-center bg-cover transition-all duration-500 ease-in-out"
            style={{
              backgroundImage: `url(${images[currentIndex]?.src})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              animation: `${slideDirection === "right-to-left"
                ? "slideFromRight"
                : "slideFromLeft"
                } 500ms ease-in-out`,
            }}
          >
            <div
              className="absolute top-[50%] left-[10%] w-[260px] sm:w-[383px] md:w-[382px] xl:w-[412px] 2xl:w-[433px] text-white flex flex-col"
              style={{ transform: "translateY(-50%)" }}
            >
              <div className="text-[30px] sm:text-[53px] xl:text-[55px] xxl:text-[60px] 2xl:text-[60px] font-bold font-man text-white leading-9 sm:leading-[50px] xl:leading-[62px] 2xl:leading-[72px]">
                {images[currentIndex]?.name}
              </div>
              <div className="text-[16px] text-[#FFCBD1] font-man font-[500] md:text-[16px] lg:text-[18px] mt-[4vh] 2xl:mt-[32px] ">Redefining style with bold trends and everyday fashion essentials.</div>
              <div className="flex gap-[12px] mt-[6vh] w-[116%] ml-[-20px] md:ml-0">
                <Link to="/register/Customer" >
                  <button className="px-3 py-2 sm:px-[25px] sm:py-[15px] md:px-[34px] md:py-[15px] bg-transparent hover:bg-[#FFBD17] text-white hover:text-[#382D13] hover:border-[#FFBD17] text-[16px] font-[400] font-arc border-[1px] rounded-[10px]">Customer Register</button>
                </Link>

                <Link to="/register/Seller">
                  <button className="px-3 py-2 sm:px-[25px] sm:py-[15px] md:px-[34px] md:py-[15px] bg-transparent hover:bg-[#FFBD17] text-white hover:text-[#382D13] hover:border-[#FFBD17] text-[16px] font-[400] border-[1px] font-arc rounded-[10px]">Seller Register</button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-[7%] sm:bottom-[9%] min-[1440px]:bottom-[40px] left-[20%] sm:left-[15%] md:left-[14%] xl:left-[13%] 2xl:left-[12%] flex space-x-[6px]" style={{ transform: 'translateX(-50%)' }}>
          {images.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => navigateTo(index)}
              className={`w-[14px] h-[14px] rounded-[4px] cursor-pointer ${(index === currentIndex) ? "bg-white" : "bg-white opacity-70"}`}
              aria-label={`Navigate to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
