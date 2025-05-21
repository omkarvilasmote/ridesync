import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../popup/popup";
import { useNavigate } from "react-router-dom";

export default function VehicleRegistration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        vehiclenumber: "",
        vehicledetails: "",
        vehiclecolor: "",
        vehiclemodel: "",
        vehicletype: "",
        carinsurance: "",
        capacity: "",
    });

    const [showPopup, setShowPopup] = useState(false);
    const [color, setColor] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:9090/registration-vehicle", formData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            if (response.data === "Success") {
                setMessage("Successfully registered vehicle");
                setColor("green");
                setShowPopup(true);
                setTimeout(() => navigate("/driver-home"), 3000);
            } if (response.data === "Driver not found") {
                setMessage("Driver not found");
                setColor("red");
                setShowPopup(true);
                setTimeout(() => navigate("/vehicle-registration"), 3000);
            }
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:9090/Vehicle-verify",
                    { withCredentials: true }
                );
                // console.log(response.data);

                if (response.data.status === 'Success') {
                    navigate('/driver-home');
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
        <div className="min-h-screen flex items-center justify-center bg-[url(../assets/rating.png)] bg-cover bg-no-repeat bg-center">
            <div className="max-w-6xl w-full mx-auto rounded-lg shadow-xl p-9 bg-white">
                {showPopup && (
                    <Popup
                        message={message}
                        color={color}
                        duration={3000}
                        onClose={() => setShowPopup(false)}
                    />
                )}

                <h1 className="text-3xl font-bold mb-8 text-center text-green-600">Vehicle Registration</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="vehiclenumber" label="Vehicle Number" value={formData.vehiclenumber} onChange={handleChange} />
                    <Input name="vehicledetails" label="Vehicle Details" value={formData.vehicledetails} onChange={handleChange} />
                    <Input name="vehiclecolor" label="Vehicle Color" value={formData.vehiclecolor} onChange={handleChange} />
                    <Input name="vehiclemodel" label="Vehicle Model" value={formData.vehiclemodel} onChange={handleChange} />
                    <Input name="vehicletype" label="Vehicle Type" value={formData.vehicletype} onChange={handleChange} />
                    <Input name="carinsurance" label="Car Insurance" value={formData.carinsurance} onChange={handleChange} />
                    <Input name="capacity" label="Capacity" type="number" value={formData.capacity} onChange={handleChange} />


                    <div className="mt-8 text-center">
                        <br></br>
                        <button
                            type="submit"
                            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-400 transition float-right"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Reusable Input Component
function Input({ name, label, value, onChange, type = "text" }) {
    return (
        <div>
            <label className="block mb-1 text-sm">{label} <span className="text-red-500">*</span></label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required
                className="w-full border rounded-lg p-1 focus:outline-none pl-3"
            />

        </div>
    );
}