import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import Popup from "../popup/popup";
import { useNavigate } from "react-router-dom";



function Login() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    // Phone number state
    const [TitlePhone, SetTitlePhone] = useState("Enter Your phone number");
    const [PhonePlaceholder, SetPlaceholderPhone] = useState("Enter Your phone number");

    // OTP State
    const [sizelength, Setsizelength] = useState(10);
    const [showPopup, setShowPopup] = useState(false);
    const [color, setColor] = useState("");
    const [message, setMessage] = useState(" ");
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [showResend, setShowResend] = useState(false);


    // const [OtpPlaceholder, SetPlaceholder] = useState("XXXXXX");




    const onChangePhone = (e) => {
        setPhone(e.target.value);
    };

    async function onetimehitApi() {
        const response = await axios.post("http://localhost:9090/verify-otp",
            {
                phone: phone
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );
    }

    const onClickLogin = async (e) => {
        e.preventDefault();
        try {
            console.log(phone.length);
            if (phone.length === 10) {
                const response = await axios.post("http://localhost:9090/login", {
                    phone: phone
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });

                const data = response.data;
                console.log(data);

                if (data === "Successfully signup" || data === "Already Registered") {
                    onetimehitApi()
                    SetTitlePhone("Enter Your OTP");
                    SetPlaceholderPhone("XXXXXX");
                    setPhone("");
                    Setsizelength(6);

                    // ⏱️ Start 2-minute timer (120 seconds)
                    setTimer(120);
                    setIsTimerRunning(true);
                }


            } else if (phone.length === 6) {
                const response = await axios.post("http://localhost:9090/verify-otp", {
                    otp: phone
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });

                const data = response.data;
                console.log(data);
                setMessage(data)
                setColor("red");
                setShowPopup(true);

                if (data === "OTP is Verified and valid") {
                    setMessage("OTP is Verified.")
                    setColor("green");
                    setShowPopup(true);
                    setTimeout(() => {
                        navigate('/selectregistration');
                    }, 3000);
                }


            }


        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval);

            setIsTimerRunning(false);
            setShowResend(true);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);


    const handleResendOTP = async () => {
        try {
            await onetimehitApi(); // Re-send OTP
            setTimer(120); // Reset timer
            setIsTimerRunning(true);
            setShowResend(false); // Hide button again
            onetimehitApi()
        } catch (error) {
            console.error("Error resending OTP:", error);
        }
    };


    return (
        <div className="bg-[#f3f4f6]">
            <div className="max-w-[1280px] mx-auto mt-20 display-flex justify-center items-center">

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
                <div className="flex w-100 h-[600px] justify-center items-center">
                    <center>
                        <form className="border-2 border-black rounded-lg p-10 bg-white shadow-xl" onSubmit={onClickLogin}>
                            <label className="text-[20px] font-bold float-left mb-2 mb-4">
                                {TitlePhone}
                            </label>
                            <div className="mt-8">
                                <input
                                    type="tel"
                                    placeholder={PhonePlaceholder}
                                    className="border-2 border-black rounded-lg py-2 float-left w-[300px] pl-3"
                                    value={phone}
                                    onChange={onChangePhone}
                                    maxlength={sizelength}
                                    required


                                />
                            </div>


                            <button
                                type="submit"
                                className="p-2 bg-red-500 mt-2 text-white rounded-lg w-[300px] mt-8"
                            >
                                Continue
                            </button>
                            {sizelength === 6 && (
                                <div className="mt-2 text-sm text-gray-600">
                                    {showResend ? (
                                        <button
                                            onClick={handleResendOTP}
                                            type="button"
                                            className="text-blue-600 font-semibold underline"
                                        >
                                            Resend OTP
                                        </button>
                                    ) : (
                                        <span>
                                            Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                                        </span>
                                    )}
                                </div>
                            )}

                            <br></br>
                            {/* <div className="flex justify-center items-center rounded-lg w-[300px] bg-gray-300 mt-6">
                                <button type="submit" className="text-white py-2">
                                    <FcGoogle size={"30px"} />
                                </button>
                            </div> */}
                        </form>
                    </center>

                </div>
            </div>
            <br></br>
            <br></br>
        </div>
    );
}

export default Login;