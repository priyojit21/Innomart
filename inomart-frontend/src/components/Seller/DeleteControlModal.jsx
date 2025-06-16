import axiosInstance from "../../middleware/axiosInterceptor";
import React from "react";
import toast, { Toaster } from "react-hot-toast";

export default function DeleteControlModal({
  active,
  setActive,
  selectedProducts,
  setDeleteTrigger,
  setSelectedProducts,
  setOpen
}) {
  const accessToken = localStorage.getItem("accessToken");

  const deleteProduct = async () => {
    if (selectedProducts.length === 0) {
      toast.error("No products selected");
      return;
    }

    try {

      const response = await axiosInstance.post(
        `http://localhost:3000/product/deleteProduct`,
        { productIds: selectedProducts },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );


      if (response.data.success) {
        toast.success("Products deleted successfully");
        setDeleteTrigger((prev) => !prev);
        setSelectedProducts([]);
        setOpen(false);
      } else {
        toast.error("Failed to delete products");
      }
    } catch (error) {
      console.error("Deletion error: ", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div>
        <div className={`${!active ? "hidden" : "block"}`}>
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
              <div className="my-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 fill-red-500 inline"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                    data-original="#000000"
                  />
                  <path
                    d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                    data-original="#000000"
                  />
                </svg>
                <h4 className="text-slate-900 text-base font-medium mt-4">
                  Are you sure you want to delete {selectedProducts.length} {selectedProducts.length > 1 ? (<>Products</>) : (<>Product</>)}
                </h4>
                <div className="text-center space-x-4 mt-10">
                  <button
                    onClick={() => setActive(false)}
                    id="closeButton"
                    type="button"
                    className="px-5 py-2.5 rounded-lg text-slate-900 text-sm font-medium bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
                  >
                    No, Cancel
                  </button>
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-red-600 hover:bg-red-700 active:bg-red-600"
                    onClick={async () => {
                      await deleteProduct();
                      setActive(false);
                    }}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
