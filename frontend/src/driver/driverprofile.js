import React, { useEffect, useState } from "react";
import axios from "axios";
import { RxActivityLog } from "react-icons/rx";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

// Helper component to update map center & zoom

function Profile() {

    const [user, setUser] = useState({});

    async function getOrders() {
        try {
            const res = await axios.get("http://localhost:9090/driver-details", {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });

            console.log("API response:", res.data.data);
            setUser(res.data.data);
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        getOrders();
    }, []);





    return (
        <div className="py-9">
            <div className="container max-w-[1280px] mx-auto flex justify-center items-center gap-6 h-[650px] ">
                <div className="w-[5%] rounded-lg shadow h-[400px] flex flex-col gap-6 justify-center items-center font-bold bg-white">
                    <button className="text-center font-bold text-xl">
                        <Link to="/driver-home">
                            <FaHome />
                        </Link>
                    </button>
                    <button className="text-black text-center font-bold text-xl">
                        <Link to="/driver-booking-details">
                            <RxActivityLog />
                        </Link>
                    </button>
                    <button className="text-black text-center font-bold text-xl text-red-500">
                        <Link to="/driver-profile">
                            <CgProfile />
                        </Link>
                    </button>
                </div>

                {/* <div className="w-[30%] text-white p-4 h-[400px]">
                    <div className="max-w-md mx-auto mt-5 space-y-4 text-black">

                    </div>
                </div> */}

                <div className="w-[50%] bg-white p-6 rounded-lg shadow h-[500px] overflow-y-auto">
                    {user && user.id ? (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Driver Profile</h2>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                {Object.entries(user).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-gray-500 font-medium mb-1">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </label>
                                        <input
                                            type="text"
                                            value={String(value)}
                                            readOnly
                                            className="w-full border rounded px-3 py-2 bg-gray-100"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No profile details found.</p>
                    )}
                </div>



            </div>
        </div>
    );
}

export default Profile;
