import React, { useEffect, useState } from "react";
import axiosInstance from "../../middleware/axiosInterceptor";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import admin from './../../assets/seller/admin.svg';

import dummy from "../../assets/user/dummyUser.jpg";
import edit from "../../assets/user/edit.svg";
import Sidebar from "../../components/user/Sidebar";
import Navbar from "../../components/user/Navbar";
import ProfilePicModal from "../../components/user/ProfilePicModal";

const UserProfile = () => {
  let user;
  let creationDate;
  let formattedDate;
  const [flag, setFlag] = useState(false);
  const [editName, setEditName] = useState(false);

  const [userDetails, setUserDetails] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    creationDate: "",
    formattedDate: "",
    profilePic: "",
    id: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProfileModal = () => {
    console.log("proflie modal called");
    setIsModalOpen(true);
  };
  const handleImageUpload = (newProfilePic) => {
    setUserDetails((prev) => ({
      ...prev,
      profilePic: newProfilePic,
    }));
  };

  async function getUserDetails() {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axiosInstance.get("http://localhost:3000/user/getUser ", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("my prof", response);

      user = response.data.userProfile.details;
      creationDate = user.createdAt;

      //Date formatting
      const today = new Date(creationDate);
      const options = { month: "long", day: "numeric", year: "numeric" };
      const formattedDateParts = today
        .toLocaleString("default", options)
        .split(" ");
      formattedDate = `${formattedDateParts[0]} ${formattedDateParts[1].replace(
        ",",
        ""
      )}, ${formattedDateParts[2]}`;

      setUserDetails({
        userName: user.firstName + " " + user.lastName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber,
        role: user.role,
        creationDate,
        formattedDate,
        profilePic: user.profilePic,
        id: user._id,
      });
    } catch (error) {
      console.log("Error occurred", error);
      toast.error(error.response.data.message || "Error Occurred");
    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <>
      <div className="lg:flex items-start">
        <div className="flex-grow">
          <Sidebar />
        </div>
        <div className="lg:flex lg:flex-col lg:w-full">
          <Navbar pageName="My Profile"
            flag={flag} />
          <div className="h-[calc(100vh-80px)] bg-[#F7F7F7] p-[20px] flex justify-center">
            <div className="flex-1 bg-[#e3e0e0] px-[10px] sm:px-[20px] pt-[23px] flex flex-col gap-[15px] items-center lg:items-start font-man">
              <div className="min-w-[300px] sm:min-w-[550px] md:min-w-[580px] md:max-h-[303px] lg:min-w-[780px] xl:min-w-[985px] xl:min-h-[144px] bg-white rounded-[10px] p-[15px] sm:p-[30px] flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-[30px]">
                <div className="sm:flex sm:flex-row gap-[10px] md:gap-[20px] lg:gap-[35px]">
                  <div className="flex justify-center items-center">
                    <img
                      className="rounded-full w-[30%] sm:w-[80%] max-w-[88px] lg:w-[88px] lg:h-[88px] object-cover"
                      src={userDetails.profilePic || admin}
                      alt="Profile Picture"
                    />
                  </div>
                  <div className="flex flex-col gap-[8px] justify-center sm:items-start items-center">
                    <p className="text-[#0C0C0C] font-bold">
                      {userDetails.userName}
                    </p>
                    {/* <p className="text-[#707070] text-[14px] font-medium">{userDetails.id}</p> */}
                  </div>
                </div>
                <div className="flex justify-center items-center md:ml-auto">
                  <div className="flex justify-center">
                    <button className=" flex text-[#979EAF] font-semibold border-[1px] rounded-[10px] px-[14px] py-[9px]" onClick={handleProfileModal}>
                      <img
                        className="pr-[5px]"
                        src={edit}
                        alt="Edit Button"

                      />
                      Edit
                    </button>
                  </div>
                  <ProfilePicModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onImageUpload={handleImageUpload}
                    id={userDetails.id}
                    setFlag={setFlag}
                    flag={flag}
                  />
                </div>
              </div>

              <div className="max-w-[300px] sm:min-w-[544px] md:max-w-[580px] lg:max-w-[780px] xl:min-w-[985px]">
                <div className=" flex flex-col lg:flex-row rounded-[10px] p-[15px] sm:p-[30px] bg-white gap-7 lg:gap-[50px] xl:lg:gap-[100px]">
                  <div className="flex flex-col gap-[20px] sm:gap-[53px]">
                    <div className="font-man font-medium text-[16px]">
                      Personal Information
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-[70px] md:gap-x-0 lg:gap-x-[27px] gap-y-[20px]  xl:gap-x-[105px] xl:gap-y-[32px] justify-items-start font-man font-medium">
                      <div className="flex flex-col">
                        <p className="text-[#0C0C0C] text-[16px] pb-[10px] sm:pb-[22px]">
                          First Name:
                        </p>
                        <p className="text-[14px] text-[#64676F]">
                          {userDetails.firstName}
                        </p>
                      </div>

                      <div className="flex flex-col">
                        <p className="text-[#0C0C0C] text-[16px] pb-[10px] sm:pb-[22px]">
                          Last Name:
                        </p>
                        <p className="text-[14px] text-[#64676F]">
                          {userDetails.lastName}
                        </p>
                      </div>

                      <div className="flex flex-col">
                        <p className="text-[#0C0C0C] text-[16px] pb-[10px] sm:pb-[22px]">
                          Email Address:
                        </p>
                        <p className="text-[14px] text-[#64676F]">
                          {userDetails.email}
                        </p>
                      </div>

                      <div className="flex flex-col">
                        <p className="text-[#0C0C0C] text-[16px] pb-[10px] sm:pb-[22px]">
                          Phone:
                        </p>
                        <p className="text-[14px] text-[#64676F]">
                          {userDetails.phone}
                        </p>
                      </div>

                      <div className="flex flex-col ">
                        <p className="text-[#0C0C0C] text-[16px] pb-[10px] sm:pb-[22px]">
                          Account Creation Date:
                        </p>
                        <p className="text-[14px] text-[#64676F]">
                          {userDetails.formattedDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center lg:items-start ">
                    <Link to={`/profile/edit/${userDetails.id}`}>
                      <div className="flex justify-center sm:ml-auto">
                        <button className=" flex text-[#979EAF] font-semibold border-[1px] rounded-[10px] px-[14px] py-[9px]" onClick={() => {
                          setEditName(true); console.log("clicked")
                        }}>
                          <img
                            className="pr-[5px]"
                            src={edit}
                            alt="Edit Button"
                          />
                          Edit
                        </button>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default UserProfile;
