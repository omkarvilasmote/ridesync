import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCar, FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Select() {
    const navigate = useNavigate();
    const [role, setRole] = useState("User");
    const [role2, setRole2] = useState("Driver");


    function onClick1() {
        console.log("clicked");
        try {
            const response = axios.post(
                "http://localhost:9090/select",
                { role },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            let data = response.data;
            console.log("data", data);
            if (data === "Success") {
                navigate('/user-registration');
            }
        } catch (error) {
            console.log("Error:", error);
        }
    }

    function onClick2() {
        try {
            const response = axios.post(
                "http://localhost:9090/select",
                { role: role2 },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            let data = response.data;
            console.log("data", data);
            if (data === "Success") {
                navigate('/driver-registration');
            }
        } catch (error) {
            console.log("Error:", error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:9090/select-verify",
                    { withCredentials: true }
                );
                console.log(response.data);

                if (response.data.role === 'User') {
                    navigate('/user-registration');
                } else if (response.data.role === 'Driver') {
                    navigate('/driver-registration');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Optionally handle the error, e.g., navigate to an error page
                // navigate('/error');
            }
        };

        fetchData();
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f3f4f6]">
            <div className="flex gap-8">
                {/* User Registration Box */}
                <div className="bg-white p-8 rounded-xl text-center w-64 border-2 border-black rounded-lg p-10">
                    <div className="flex items-center m-4 d-flex items-center align-items-center justify-center">
                        <FaUserAlt className="text-green-400" fontSize={"50px"} />
                    </div>
                    <h3 className="text-lg font-semibold mb-4">User Registration</h3>
                    <Link to="../user-registration">
                        <button
                            className="w-full bg-red-400 text-white py-2 rounded hover:bg-green-500 transition"
                            onClick={onClick1}
                        >
                            Register as User
                        </button>
                    </Link>
                </div>

                {/* Driver Registration Box */}
                <div className="bg-white p-8 rounded-xl text-center w-64 border-2 border-black rounded-lg p-10">
                    <div className="flex items-center m-4 d-flex items-center align-items-center justify-center">
                        <FaCar className="text-green-400" fontSize={"50px"} />
                    </div>
                    <h3 className="text-lg font-semibold mb-4">Driver Registration</h3>
                    <Link to="driver-registration">
                        <button
                            className="w-full bg-red-400 text-white py-2 rounded hover:bg-green-500 transition"
                            onClick={onClick2}
                        >
                            Register as Driver
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Select;