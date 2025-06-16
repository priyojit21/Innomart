import React from "react";
import { Modal } from "antd";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../middleware/axiosInterceptor";
import { useForm } from "react-hook-form";
import { Flag } from "lucide-react";

export default function ProfilePicModal({
  isModalOpen,
  setIsModalOpen,
  onImageUpload,
  id,
  setFlag,
  flag
}) {
  const accessToken = localStorage.getItem("accessToken");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("uploadedFile", data.file[0]);
      formData.append("userId", id);

      const response = await axiosInstance.post(
        `http://localhost:3000/user/uploadProfilePic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );


      if (response.data.success) {
        toast.success("File uploaded successfully!");
        onImageUpload(response.data.profilePic);
        reset();
        setFlag(!flag)
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 400) {
        toast.error("File already exists.");
      } else {
        toast.error("File upload failed.");
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        className="p-6 shadow"
      >
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-3xl text-[#0077b6] mb-4">
            Upload Profile Pic
          </h1>
          <form
            className="flex flex-col items-center gap-4 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col items-center w-full">
              <input
                type="file"
                {...register("file", { required: "File is required" })}
                className={`border ${
                  errors.file ? "border-red-500" : "border-gray-300"
                } rounded-lg p-2 w-full max-w-[400px]`}
              />
              <span>Only .jpg .jpeg .webp .png file is accepted</span>
              <span className="text-red-500 mt-2">
                {errors.file?.message || " "}
              </span>
            </div>
            <button
              type="submit"
              className="text-xl border-black border-2 p-2 px-5 bg-[#0077b6] text-white rounded-lg transition duration-300 ease-in-out hover:bg-[#005f8a] hover:scale-105"
            >
              Save
            </button>
          </form>
        </div>
      </Modal>
      <Toaster />
    </>
  );
}
