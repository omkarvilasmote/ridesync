import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Popup from '../popup/popup';
import { useNavigate } from "react-router-dom";

export default function UserRegistration() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        drivername: "",
        adhaarnumber: "",
        pancardnumber: "",
        licencenumber: "",
        rcbook: "",
        gender: "",
        age: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        dob: "",
        maritalstatus: "",
        medicaldetails: "",
        disabilitydesc: "",
        birthmark: "",
        drivingexperienceyears: "",
        emergencycontactnum: "",
        // ownimg: "Https://"
    });

    const [showPopup, setShowPopup] = useState(false);
    const [color, setColor] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData((prev) => ({
                ...prev,
                [name]: files[0],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: name === 'age' || name === 'drivingexperienceyears'
                    ? parseInt(value, 10) || ''
                    : value,
            }));
        }
    };

    const validateForm = () => {
        const requiredFields = [
            'drivername', 'adhaarnumber', 'pancardnumber', 'licencenumber',
            'rcbook', 'gender', 'age', 'address', 'city', 'state', 'pincode',
            'dob', 'maritalstatus', 'medicaldetails', 'birthmark',
            'drivingexperienceyears', 'emergencycontactnum'
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                setMessage(`Please fill the required field: ${field}`);
                setColor("red");
                setShowPopup(true);
                return false;
            }
        }

        if (!/^\d{12}$/.test(formData.adhaarnumber)) {
            setMessage("Invalid Aadhaar number. Must be 12 digits.");
            setColor("red");
            setShowPopup(true);
            return false;
        }

        if (formData.age < 18 || formData.age > 100) {
            setMessage("Age must be between 18 and 100.");
            setColor("red");
            setShowPopup(true);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            const response = await axios.post(
                "http://localhost:9090/registration-driver",
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.data.code === 200) {
                setMessage(response.data.message);
                setColor("green");
                setShowPopup(true);
                setTimeout(() => navigate('/vehicle-registration'), 3000);
            } else {
                setMessage(response.data.message);
                setColor("red");
                setShowPopup(true);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setMessage("Server error. Try again later.");
            setColor("red");
            setShowPopup(true);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:9090/driver-verify",
                    { withCredentials: true }
                );
                // console.log(response.data);

                if (response.data.status === 'Success') {
                    navigate('/vehicle-registration');
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
        <div className=''>
            <div className="items-center bg-[url(../assets/rating.png)] bg-cover bg-no-repeat bg-center ">

                <div className="max-w-6xl mx-auto rounded-lg shadow-xl p-9 bg-white mt-20">
                    {showPopup && (
                        <Popup
                            message={message}
                            color={color}
                            duration={3000}
                            onClose={() => setShowPopup(false)}
                        />
                    )}
                    <h1 className="text-3xl font-bold mb-8 text-center text-green-600">
                        Driver Registration
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Text inputs */}
                            {[
                                { label: "Driver Name", name: "drivername", type: "text" },
                                { label: "Aadhaar Number", name: "adhaarnumber", type: "text" },
                                {
                                    label: "PAN Card Number",
                                    name: "pancardnumber",
                                    type: "text",
                                },
                                {
                                    label: "License Number",
                                    name: "licencenumber",
                                    type: "text",
                                },
                                { label: "RC Book", name: "rcbook", type: "text" },
                                { label: "Age", name: "age", type: "number" },
                                { label: "Address", name: "address", type: "text" },
                                { label: "City", name: "city", type: "text" },
                                { label: "State", name: "state", type: "text" },
                                { label: "Pincode", name: "pincode", type: "text" },
                                { label: "Date of Birth", name: "dob", type: "date" },
                                { label: "Birth Mark", name: "birthmark", type: "text" },
                                {
                                    label: "Driving Experience (Years)",
                                    name: "drivingexperienceyears",
                                    type: "number",
                                },
                                {
                                    label: "Emergency Contact",
                                    name: "emergencycontactnum",
                                    type: "text",
                                },
                            ].map(({ label, name, type }) => (
                                <div key={name}>
                                    <label className="block mb-1 text-sm">
                                        {label} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-1 focus:outline-none pl-3"
                                        required
                                    />
                                </div>
                            ))}

                            {/* Select: Gender */}
                            <div>
                                <label className="block mb-1 text-sm">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-1"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Select: Marital Status */}
                            <div>
                                <label className="block mb-1 text-sm">
                                    Marital Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="maritalstatus"
                                    value={formData.maritalstatus}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-1"
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Unmarried">Unmarried</option>
                                </select>
                            </div>

                            {/* Select: Medical Details */}
                            <div>
                                <label className="block mb-1 text-sm">
                                    Medical Details <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="medicaldetails"
                                    value={formData.medicaldetails}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-1"
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="None">None</option>
                                    <option value="Disability">Disability</option>
                                </select>
                            </div>

                            {/* Conditional: Disability Description */}
                            {formData.medicaldetails === "Disability" && (
                                <div>
                                    <label className="block mb-1 text-sm">
                                        Disability Description{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="disabilitydesc"
                                        value={formData.disabilitydesc}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-1"
                                        required
                                    />
                                </div>
                            )}

                            {/* File Upload */}
                            {/* <div>
                            <label className="block mb-1 text-sm">Upload Photo <span className="text-red-500">*</span></label>
                            <input
                                type="file"
                                name="ownimg"
                                onChange={handleChange}
                                accept="image/*"
                                className="w-full border rounded-lg p-1"
                                required
                            />
                        </div> */}
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                type="submit"
                                className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-400 transition"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
