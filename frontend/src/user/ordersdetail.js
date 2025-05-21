import React, { useEffect, useState } from "react";
import axios from "axios";
import { RxActivityLog } from "react-icons/rx";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

function OrderDetails() {
    const [orders, setOrders] = useState([]);


    async function getOrders() {
        try {
            const res = await axios.get("http://localhost:9090/user-bookingdsdetails", {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            let data = res.data;
            console.log(data);
            const ordersArray = Array.isArray(data) ? data : [data];

            setOrders(ordersArray);

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <div className="py-9">
            <div className="container max-w-[1280px] mx-auto flex justify-center items-center gap-6 h-[650px]">
                <div className="w-[5%] rounded-lg shadow h-[400px] flex flex-col gap-6 justify-center items-center font-bold bg-white">
                    <Link to="/user-home" className="text-xl">
                        <FaHome />
                    </Link>
                    <Link to="/booking-details" className="text-xl text-red-500">
                        <RxActivityLog />
                    </Link>
                    <Link to="/user-profile" className="text-xl">
                        <CgProfile />
                    </Link>
                </div>

                <div className="w-[50%] bg-white p-4 rounded-lg shadow h-[500px] overflow-y-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                        Booking Details
                    </h2>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 p-4 rounded-md shadow-sm mb-4 hover:shadow-md transition duration-200"
                            >
                                <h2 className="text-lg font-semibold mb-2 text-red-500">
                                    Order #{order.id}
                                </h2>
                                <div className="text-gray-700 text-sm space-y-1">
                                    <p>
                                        <span className="font-medium">Driver Name:</span>{" "}
                                        {order.Name}
                                    </p>
                                    <p>
                                        <span className="font-medium">From (Lat, Lng):</span>{" "}
                                        {order.fromlatude}, {order.fromlontatude}
                                    </p>
                                    <p>
                                        <span className="font-medium">To (Lat, Lng):</span>{" "}
                                        {order.tolatitude}, {order.tolontatude}
                                    </p>
                                    <p>
                                        <span className="font-medium">Distance (KM):</span>{" "}
                                        {order.km}
                                    </p>
                                    <p>
                                        <span className="font-medium">Amount:</span> ₹
                                        <span className="text-white bg-green-500 px-2 rounded-[100px]">
                                            {order.Amount}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="font-medium">Booking Code:</span>{" "}
                                        {order.code}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No orders found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
