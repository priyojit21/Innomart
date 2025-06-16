import React, { useEffect, useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import ProductSidebar from './ProductSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { showUser } from '../../features/productDetailSlice';

export default function Table() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [myProduct, setmyProduct] = useState([]);
    const tableHeadings = ["Item name", "Customer", "Date", "Price", "Status", "Qty", ""];

    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.app);
    const searchData = useSelector((state) => state.app.searchData);
    const selectedOption = useSelector((state) => state.app.selectedOption);
    const statusState = useSelector((state) => state.app.statusState);
    const sortOrder = useSelector((state)=> state.app.sortOrder);
    const sortField = useSelector((state)=> state.app.sortField);

    const fetchOrders = () => {
        const params = {
            search: searchData,
            searchBy: selectedOption,
            status: statusState,
            sortOrder: sortOrder,
            sortField: sortField,
            limit: 200
        };
        dispatch(showUser(params));
    };
    
    useEffect(() => {
        fetchOrders();
    }, [searchData, selectedOption, statusState, sortOrder, sortField]);
    

    const handleOpenSidebar = (product) => {
        setSelectedProduct(product);
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedProduct(null);
    };

    return (
        <div>
            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="border-0 rounded-lg divide-y divide-gray-200">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3 px-4 pe-0"></th>
                                            {tableHeadings.map((head, index) => {
                                                return <th key={index} scope="col" className="px-6 py-3 text-start text-xs font-medium text-[#0C0C0C]">
                                                    {head}
                                                </th>
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {
                                            orders.map((item, index) => (
                                                <tr key={index} >
                                                    <td className="py-3 ps-4">
                                                        <div className="flex items-center h-5">
                                                            <input
                                                                id="hs-table-pagination-checkbox-1"
                                                                type="checkbox"
                                                                className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                                            />
                                                            <label htmlFor="hs-table-pagination-checkbox-1" className="sr-only">
                                                                Checkbox
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0C0C0C]">
                                                        {item.productId?.productName}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#707070]">
                                                        {item.userId?.firstName}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#707070]">
                                                        {new Date(item.orderAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#707070]">
                                                        <span>&#8377;</span> {item.price}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#707070]">
                                                        {item.status}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#707070]">
                                                        {item.quantity} pcs
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium flex justify-center items-center">
                                                        <button
                                                            type="button"
                                                            className="text-sm font-semibold rounded-lg border border-transparent text-[#707070] disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none"
                                                            onClick={() => { handleOpenSidebar(item); setmyProduct(item) }}
                                                        >
                                                            <BsThreeDots />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <ProductSidebar
                isOpen={isSidebarOpen}
                product={selectedProduct}
                onClose={handleCloseSidebar}
                myProduct={myProduct}
                setmyProduct={setmyProduct}
                refreshOrders={fetchOrders}
            />
        </div >
    );
}
