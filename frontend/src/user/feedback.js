import React, { useState } from "react";
import Popup from "../popup/popup"
import axios from "axios";

export default function Feedback() {
    const [showPopup, setShowPopup] = useState(false);
    const [color, setColor] = useState("");
    const [message, setMessage] = useState(" ");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:9090/feedback",
                {
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        withCredentials: true
                    },
                }
            );


            if (response.data.code === 200) {
                // alert("Feedback submitted successfully!");
                setFormData({ name: "", email: "", message: "" });

                setMessage(response.data.message);
                setColor("green");
                setShowPopup(true);


            } else {
                alert("Failed to submit feedback.");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("An error occurred.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f3f4f6] p-4">
            {showPopup && (
                <Popup
                    message={message}
                    color={color}
                    duration={3000}
                    onClose={() => setShowPopup(false)}
                />
            )}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Feedback
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">
                            Name<span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">
                            Email<span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">
                            Message<span className="text-red-500 ml-1">*</span>
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Your feedback"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-green-500"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-300"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
