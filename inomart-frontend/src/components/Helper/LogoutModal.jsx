import React from "react";
import { Toaster } from "react-hot-toast";
import axiosInstance from "../../middleware/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";

export default function LogOutModal({ active, setActive }) {
  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const handleLogout = async () => {
    if (role) {
      try {
        await axiosInstance.delete("http://localhost:3000/user/logout", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        localStorage.clear();
        navigate("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  return (
    <>
      <div id="modal" className={`${!active ? "hidden" : "block"}`}>
        <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto">
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative">
            <svg
              id="closeIcon"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
              viewBox="0 0 320.591 320.591"
              onClick={() => setActive(false)}
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              />
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              />
            </svg>
            <div className="my-6 text-center flex w-full items-center flex-col">
              <div className="">

                <RiLogoutBoxRLine size={100} />
              </div>
              <h4 className="text-slate-900 text-base font-medium mt-4">
                Are you sure you want to log out?
              </h4>
              <div className="text-center space-x-4 mt-10">
                <button
                  onClick={() => setActive(false)}
                  id="closeButton"
                  type="button"
                  className="px-5 py-2.5 rounded-lg text-slate-900 text-sm font-medium bg-gray-200 hover:bg-gray-300"
                >
                  No, Cancel
                </button>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    handleLogout();
                    setActive(false);
                  }}
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
}
