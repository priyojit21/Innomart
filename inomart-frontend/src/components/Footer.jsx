import React, { useState } from "react";
import logo from '../assets/innomartLogo.svg';
import faceBook from '../assets/Footer/facebook.svg';
import twitter from '../assets/Footer/twitter.svg';
import instagram from '../assets/Footer/instagram.svg';
import linkedIn from '../assets/Footer/linkedIn.svg';
import { ArrowRight } from "lucide-react";
import { HashLink as Link } from "react-router-hash-link";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");


  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!email) return;

    try {
      await emailjs.send(
        "service_1cyj0ej",
        "template_ir7b9rg",
        {
          user_email: email,
          to_email: "priyojit@itobuz.com",
        },
        "Dk5XV8thfyHpNf8bp"
      );
      toast.success("Newsletter subscription sent!")
      setEmail("");
    } catch (error) {
      console.error("Failed to send email", error);
      toast.error("Failed to subscribe. Please try again.");
    }
  };

  return (
    <>
      <footer className="w-full mt-10 lg:mt-[130px] bg-[#1A1C2E] text-white" id="footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between py-6 lg:py-[90px] xl:py-[106px] gap-8 md:gap-12 lg:gap-[60px] xl:gap-[95px]">

            <div className="flex flex-col items-center lg:items-start text-center lg:text-left  w-full max-w-[305px] mx-auto">
              <Link to="#">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="logo" className="w-12" />
                  <h3 className="text-xl font-rob font-medium lg:text-[20px] xl:text-[31px]">InnoMart</h3>
                </div>
              </Link>


              <p className="mt-[4%] font-man font-normal max-w-sm md:max-w-[18rem] xl:mt-[48px]">
                From everyday essentials to standout pieces, our curated picks bring excitement, personality, and quality to your shopping experience. Ordinary isn’t our thing—let’s make it memorable.
              </p>

              <div className="flex mt-8 gap-[20px] lg:gap-[40px] xl:mt-[62px]">
                <p className="font-man font-semibold">Follow Us:</p>
                <div className="flex justify-center items-center gap-3 lg:gap-[20px]">
                  <Link to="https://www.facebook.com/">
                    <img src={faceBook} alt="fb" />
                  </Link>
                  <Link to="https://x.com/">
                    <img src={twitter} alt="fb" />
                  </Link>
                  <Link to="https://www.instagram.com/">
                    <img src={instagram} alt="fb" />
                  </Link>
                  <Link to="https://www.linkedin.com/feed/">
                    <img src={linkedIn} alt="fb" />
                  </Link>
                </div>
              </div>
            </div>



            <div className="flex flex-col lg:flex-row w-full justify-between gap-8 lg:gap-[95px] xl:gap-[201px]">
              <div className="mx-auto text-center lg:text-left xl:max-w-[99px]">
                <h4 className="pb-4 font-arc lg:pb-[58px] text-[#f82e7c] font-medium text-lg">Quick Links</h4>
                <ul className="flex flex-col md:flex-row lg:flex-col gap-4 xl:gap-6 lg:w-[99px]">
                  <li>
                    <Link smooth to="#banner" className="hover:text-[#EC2F79] font-man transition-all xl:text-[18px]">Deals</Link>
                  </li>
                  <li>
                    <Link smooth to="#hero" className="hover:text-[#EC2F79] font-man transition-all xl:text-[18px]">What's New</Link>
                  </li>
                  <li>
                    <Link smooth to="#footer" className="hover:text-[#EC2F79] font-man transition-all xl:text-[18px]">Contact</Link>
                  </li>
                </ul>
              </div>
              <div className="text-center lg:text-left lg:max-w-md xl:max-w-[470px]">
                <h4 className="pb-4 font-arc lg:pb-[58px] text-[#EC2F79] font-medium text-lg">Newsletter</h4>
                <p className="mx-auto font-man font-normal mb-[26px] lg:mx-0 w-[60%]">
                  Subscribe to the newsletter and get some crispy stuff every week.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="mt-4 flex items-center lg:mt-6 max-w-lg mx-auto p-2 bg-[#23263B] rounded-full shadow-md xl:w-[470px]">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    className="flex-1 bg-transparent text-white placeholder:text-white placeholder:font-man px-4 py-3 outline-none"
                  />
                  <button className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-[#FD5B2C] to-[#F21D68] rounded-full lg:w-14 lg:h-14 xl:w-16 xl:h-16 hover:scale-105 transition">
                    <ArrowRight className="text-white" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-[#33364B] font-man py-4 text-center text-sm lg:py-8 lg:text-[16px] text-[#848A91]">
          &copy; 2025 <span className="text-white">Innomart</span> All Rights Reserved
        </div>
      </footer >
      <Toaster />
    </>
  );
};

export default Footer;



