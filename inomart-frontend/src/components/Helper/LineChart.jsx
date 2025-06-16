import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Select } from 'antd';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart({ earnings, setEarnings, orders, setOrders }) {
    const accessToken = localStorage.getItem("accessToken");

    const [chartData, setChartData] = useState({
        labels: [],
        earningsData: [],
        ordersData: [],
    });

    const [selectedChart, setSelectedChart] = useState("earnings");

    const fetchData = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/order/getSalesBreakDown`, {
                timeRange: 'monthly',
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const { data } = response.data;
            const highestEarning = response.data.highestEarning;
            const highestOrder = response.data.highestOrder;

            setEarnings(highestEarning.earning);
            setOrders(highestOrder.orders);

            const labels = data.map(item => item.month);
            const earnings = data.map(item => item.totalRevenue);
            const orders = data.map(item => item.totalOrders);

            setChartData({
                labels,
                earningsData: earnings,
                ordersData: orders,
            });
        } catch (error) {
            console.error("Chart error", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChartChange = (value) => {
        setSelectedChart(value);
    };

    const chartConfig = {
        labels: chartData.labels,
        datasets: [
            {
                label: selectedChart === "earnings" ? "Earnings" : "Orders",
                data: selectedChart === "earnings" ? chartData.earningsData : chartData.ordersData,
                borderColor: selectedChart === "earnings" ? "#774BF1" : "#EC2F79",
                fill: true,
                pointRadius: 1,
                borderWidth: 2,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: 0,
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    padding: 10,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    padding: 4,
                },
                grid: {
                    drawBorder: false,
                }
            },
        },
    };

    return (
        <div className='3xl:w-[847px] bg-[#FFFFFF] p-[20px] rounded-[20px] flex-grow'>
            <div className='flex justify-between items-start w-full'>
                <div className='flex flex-col justify-start items-start gap-3'>
                    <p className='text-[#0C0C0C] text-xl font-man font-semibold'>
                        {selectedChart === 'earnings' ? 'Highest Earnings' : 'Highest Orders'}
                    </p>
                    <Select
                        defaultValue="earnings"
                        style={{
                            width: 100,
                            height: 25,
                            color: "#707070",
                            fontFamily: "Manrope"
                        }}
                        onChange={handleChartChange}
                        options={[
                            { value: 'earnings', label: 'Earnings' },
                            { value: 'orders', label: 'Orders' },
                        ]}
                    />
                </div>
                <div style={{ minHeight: '40px' }}>
                    <p className="font-semibold text-lg text-[#0C0C0C] xl:text-[30px]">
                        {selectedChart === 'earnings' ? `₹ ${earnings}` : orders}
                    </p>
                </div>
            </div>

            <div style={{ height: '350px' }}>
                <Line options={options} data={chartConfig} />
            </div>
        </div>
    );
}

