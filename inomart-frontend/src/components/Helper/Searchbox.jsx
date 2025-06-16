import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDebouncedSearch, searchProduct } from '../../features/productDetailSlice';

export default function Searchbox() {
    const dispatch = useDispatch();
    const searchData = useSelector((state) => state.app.searchData);
    const debouncedSearch = useSelector((state) => state.app.debouncedSearch);

    const [inputValue, setInputValue] = useState(searchData);


    useEffect(() => {
        const handler = setTimeout(() => {
            dispatch(setDebouncedSearch(inputValue)); 
        }, 500); 

        return () => {
            clearTimeout(handler); 
        };
    }, [inputValue, dispatch]);

    useEffect(() => {
            dispatch(searchProduct(debouncedSearch)); 
    }, [debouncedSearch, dispatch]);

    const handleSearch = (e) => {
        setInputValue(e.target.value); 
    };

    const handleClearSearch = () => {
        setInputValue('');
        dispatch(searchProduct('')); 
    };

    return (
        <div>
            <div className="relative">
                <input
                    className="appearance-none border-2 pl-10 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline placeholder:text-[#52575C]"
                    id="username"
                    type="text"
                    value={inputValue} 
                    onChange={handleSearch}
                    placeholder="Search..."
                />
                <div className="absolute right-0 inset-y-0 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="-ml-1 mr-3 h-5 w-5 text-gray-400 hover:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        onClick={handleClearSearch}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>

                <div className="absolute left-0 inset-y-0 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 ml-3 text-gray-400 hover:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
