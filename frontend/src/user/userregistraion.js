import React, { useState, useEffect } from "react";
import axios from 'axios';
import Popup from '../popup/popup';
import { useNavigate } from "react-router-dom";


export default function UserRegistration() {
    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: " ",
        state: " ",
        city: " ",
        address: " ",
        pincode: " ",
    });

    const [showPopup, setShowPopup] = useState(false);
    const [color, setColor] = useState("");
    const [message, setMessage] = useState(" ");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:9090/user-verify",
                    { withCredentials: true }
                );
                // console.log(response.data);

                if (response.data.status === 'Success') {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Optionally handle the error, e.g., navigate to an error page
                // navigate('/error');
            }
        };

        fetchData();
    }, [navigate]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);


        // Send data to the server or perform other actions
        try {
            let response = await axios.post("http://localhost:9090/registration-user", formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            // console.log("Success:", response.data.message);
            if (response.data.code === 200) {

                setMessage(response.data.message)
                setColor("green");
                setShowPopup(true);
                setTimeout(() => {
                    navigate('/');
                }, 3000);

            } else {
                setMessage(response.data.message);
                setColor("red");
                setShowPopup(true);
            }



        } catch (error) {
            console.error("Error submitting form:", error);
        }

    };



    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[url(../assets/rating.png)] bg-cover bg-no-repeat bg-center">
            <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-xl">
                <div>
                    {showPopup && (
                        <Popup
                            message={message}
                            color={color}
                            duration={3000}
                            onClose={() => setShowPopup(false)}
                        />
                    )}
                </div>
                <br></br>

                <h1 className="text-3xl font-bold mb-6 text-center text-green-500">
                    User Registration
                </h1>
                <br></br>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm">Name <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">City <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Pincode <span className='text-red-500'>*</span></label>
                                <input
                                    type="number"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm">State <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Address <span className='text-red-500'>*</span></label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:outline-none"
                                    rows="3"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            type="submit"
                            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-400 transition float-right"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
