import React, { useState, useEffect } from "react";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaCircleStop } from "react-icons/fa6";
import axios from 'axios';
import "../styles/home.css";
import SearchVehicle from "../user/searchvehicle";
import { useNavigate } from "react-router-dom";
import Popup from '../popup/popup';

import Cash from "../assets/icons/cash.png";
import Verified from "../assets/icons/verified.png";
import Support from "../assets/icons/support.png";
import Features from "../assets/icons/Features.png";
import Time from "../assets/icons/time.png";
import Payment from "../assets/icons/payment.png";
import Booking from "../assets/icons/booking.png";
import Star from "../assets/icons/star.png";
import Logo from "../assets/logo.png";
import Hansel from "../assets/Hansel.svg"





function Home() {
  const navigate = useNavigate();
  const API_KEY = "pk.5feda230ecb59b5132c66e8cf7d17f3e";
  const [allocated, setAllocated] = useState("");
  const [allocated2, setAllocated2] = useState("");
  const [NewSearch, Newdata] = useState([]);
  const [NewSearch2, Newdata2] = useState([]);

  const [fromlon, setFromlon] = useState('');
  const [fromlat, setFromlat] = useState('');

  const [toLon, setToLon] = useState('');
  const [tolat, setTolat] = useState('');

  const [feedbackList, setFeedback] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [color, setColor] = useState("");
  const [message, setMessage] = useState(" ");



  async function fetchData(newValue) {
    try {
      const response = await axios.get(`https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${newValue}&limit=5&dedupe=2&`);
      console.log(response.data);
      Newdata(response.data);
      // console.log(response.data.display_name);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function fetchData2(newValue) {
    try {
      const response = await axios.get(`https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${newValue}&limit=5&dedupe=2&`);
      // console.log(response.data);
      Newdata2(response.data);
      // console.log(response.data.display_name);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }



  const Onchange = (e) => {
    const newValue = e.target.value;
    fetchData(newValue);
    setAllocated(newValue);
  };


  const Onchange2 = (e) => {
    const newValue = e.target.value;
    fetchData2(newValue);
    setAllocated2(newValue);
  }

  function SelectedSearch(value) {
    // console.log(value);
    setAllocated(value);
    // fetchData(value);
    Newdata([]);
  }

  function SelectedSearch2(value) {
    console.log(value);
    setAllocated2(value);
    // fetchData2(value);
    Newdata2([]);

  }


  async function finalfetch(newValue) {
    try {
      const response = await axios.get(`https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${newValue}&limit=5&dedupe=2&viewbox=74.55,16.90,74.65,16.80&bounded=1
`);
      for (const item of response.data) {
        if (item.display_name === allocated) {
          return { lon: item.lon, lat: item.lat };
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return null;
  }

  async function finalfetch2(newValue) {
    try {
      const response = await axios.get(`https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${newValue}&limit=5&dedupe=2&viewbox=74.55,16.90,74.65,16.80&bounded=1
`);
      for (const item of response.data) {
        if (item.display_name === allocated2) {
          return { lon: item.lon, lat: item.lat };
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return null;
  }


  const dataSubmit = async (e) => {
    e.preventDefault();
    if (allocated !== allocated2) {
      const from = await finalfetch(allocated);
      const to = await finalfetch2(allocated2);

      if (from && to) {
        setFromlon(from.lon);
        setFromlat(from.lat);
        setToLon(to.lon);
        setTolat(to.lat);

        // console.log("fromlon:", from.lon);
        // console.log("fromlat:", from.lat);
        // console.log("tolon:", to.lon);
        // console.log("tolat:", to.lat);

        navigate(`/search-vehicle?fromlontitude=${from.lon}&fromlatitude=${from.lat}&tolontitude=${to.lon}&tolatitude=${to.lat}`);
      } else {
        setMessage('Could not find location coordinates');
        setColor("red");
        setShowPopup(true);
      }
    } else {
      setMessage('Please enter a valid address');
      setColor("red");
      setShowPopup(true);
    }
  };



  useEffect(() => {
    // Fetch feedback from your API
    axios.get("http://localhost:9090/get-feedbacks") // Change this to your endpoint
      .then(res => {
        setFeedback(res.data.feedback); // assuming { feedback: [...] }
      })
      .catch(err => {
        console.error("Failed to fetch feedback", err);
      });
  }, []);


  return (
    <div>
      <div className="bg-[url(../assets/final.png)] bg-no-repeat bg-center h-[648px] bg-cover mt-20">
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
        <div className="bg-green-500 text-white p-2">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-lg text-white">
              Book your first ride today and{" "}
              <span className="text-[#ff0000] font-bold">
                get 20% off with code FIRST20!
              </span>
            </span>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-5xl font-bold my-3 text-center py-6 text-center">
            "Share a <span className="text-green-500">Ride</span>, Share the{" "}
            <span>Fun!</span>"
          </h1>
          <div className="flex justify-center items-center">
            <form className="flex flex-col w-[500px] p-5">
              <div className="relative w-full">
                <label className="text-lg py-2 rounded-md flex items-center font-bold">
                  <FaArrowRightFromBracket className="mr-2 text-lg" />
                  From
                </label>
                <input
                  type="text"
                  className="border-2 py-3 ps-3 text-ms rounded-md z-20 border-black w-full"
                  value={allocated}
                  onChange={Onchange}
                  placeholder="I am here now"
                />
                {NewSearch.length > 0 && (
                  <ul className="absolute top-full w-full z-30 shadow-lg bg-gray-100 border rounded-md">
                    {NewSearch.map((item, index) => (
                      <li
                        key={index}
                        className="bg-white p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => SelectedSearch(item.display_name)}
                      >
                        {item.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="relative w-full">
                <label className="text-lg py-2 rounded-md flex items-center font-bold">
                  <FaCircleStop className="mr-2 text-lg" />
                  To
                </label>
                <input
                  type="text"
                  placeholder="I want go here"
                  className="border-2 py-3 ps-3 text-ms rounded-md mb-4 z-20 border-black w-full"
                  value={allocated2}
                  onChange={Onchange2}
                />
                {NewSearch2.length > 0 && (
                  <ul className="absolute top-full w-full z-30 shadow-lg bg-gray-100 border rounded-md">
                    {NewSearch2.map((item, index) => (
                      <li
                        key={index}
                        className="bg-white p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => SelectedSearch2(item.display_name)}
                      >
                        {item.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                className="bg-green-500 text-white p-2 rounded-md mt-4 z-20"
                onClick={dataSubmit}
              >
                Book a Ride
              </button>
            </form>
          </div>
        </div>
        <br></br>
      </div>

      {/* Fetures */}
      <div className="bg-[url(../assets/rating1.png)] bg-cover bg-center bg-repeat">
        <div className=" max-w-[1280px] mx-auto display:flex justify-center items-center mt-10 ">
          <h2 className="mt-10 text-3xl font-bold pt-20">
            <img
              src={Features}
              className="w-20 float-left bg-red-500 text-white rounded-md mr-3"
            ></img>
            <p className="text-3xl font-bold m-3 p-3">Features</p>
          </h2>

          <div className="flex justify-center items-center">
            <div className="box w-1/4 p-4 shadow-lg shadow-red-500/50 bg-green-500 rounded-md m-10">
              <div className="ml-3 p-3">
                <img src={Cash} className="w-20"></img>
              </div>
              <div>
                <p className="text-sm text-white">
                  <p className="text-white">
                    <b>Affordable Rides</b>
                  </p>
                  Enjoy competitive pricing with no hidden fees. Get to your
                  destination without breaking the bank.
                </p>
              </div>
            </div>
            <div className="box w-1/4 p-4 shadow-lg shadow-red-500/50 bg-green-500 rounded-md m-10">
              <div className="ml-3 p-3">
                <img src={Verified} className="w-20"></img>
              </div>
              <div>
                <p className="text-sm text-white">
                  <p className="text-white">
                    <b>Safe & Verified Drivers</b>
                  </p>
                  All drivers undergo rigorous background checks and vehicle
                  inspections for your peace of mind.{" "}
                </p>
              </div>
            </div>

            <div className="box w-1/4 p-4 shadow-lg shadow-red-500/50 bg-green-500 rounded-md m-10">
              <div className="ml-3 p-3">
                <img src={Support} className="w-20"></img>
              </div>
              <div>
                <p className="text-sm text-white">
                  <p className="text-white">
                    <b>24/7 Customer Support</b>
                  </p>
                  Our support team is available around the clock to assist with
                  bookings, issues, or questions.{" "}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="box w-1/4 p-4 shadow-lg shadow-red-500/50 bg-green-500 rounded-md m-10">
              <div className="ml-3 p-3">
                <img src={Time} className="w-20"></img>
              </div>
              <div>
                <p className="text-sm text-white">
                  <p className="text-white">
                    <b>Real-Time Ride Tracking</b>
                  </p>
                  Track your ride live on the map and share your trip details
                  with loved ones for added safety.
                </p>
              </div>
            </div>
            <div className="box w-1/4 p-4 shadow-lg shadow-red-500/50 bg-green-500 rounded-md m-10">
              <div className="ml-3 p-3">
                <img src={Booking} className="w-20"></img>
              </div>
              <div>
                <p className="text-sm text-white">
                  <p className="text-white">
                    <b>Flexible Booking Options</b>
                  </p>
                  Book now or schedule rides in advance to fit your plans
                  perfectly.
                </p>
              </div>
            </div>

            <div className="box w-1/4 p-4 shadow-lg shadow-red-500/50 bg-green-500 rounded-md m-10">
              <div className="ml-3 p-3">
                <img src={Payment} className="w-20"></img>
              </div>
              <div>
                <p className="text-sm text-white">
                  <p className="text-white">
                    <b>Seamless Payments</b>
                  </p>
                  Pay securely with multiple options, including cards, mobile
                  wallets, or cash.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <br></br>
      </div>
      {/* About website */}
      <div
        className="h-screen w-full bg-gray-100 flex items-center justify-center"
        id="about"
      >
        <div className="max-w-[1280px] w-full flex flex-col md:flex-row items-center justify-between px-4">
          {/* Left Side Box (Image) */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-[url(../assets/iconbox.png)] bg-cover bg-center bg-repeat h-[600px]">
            {/* <img
              src="../assets/iconbox.png" 
              alt="RideSync Carpooling"
              className="rounded-xl shadow-lg w-full h-auto object-cover"
            /> */}
          </div>

          {/* Right Side Box (Info Text) */}
          <div className="w-full md:w-1/2 p-6 bg-white border-2 border-green-500 rounded-lg shadow-md">
            <h2 className="font-bold text-3xl mb-4">
              About <span className="text-green-500 text-4xl">RideSync</span>
            </h2>
            <p className="mb-4">
              RideSync is a smart carpooling platform designed to make your
              travel safer, cheaper, and more eco-friendly. Whether you're
              heading to work, college, or an event, our app helps you find and
              share rides with trusted users.
            </p>
            <p className="mb-2">
              Book rides easily, reduce traffic, and save fuel—all while meeting
              new people. RideSync offers real-time booking, secure
              driver/passenger profiles, and seamless payment options.
            </p>
            <p className="font-semibold text-green-600 mt-4">
              Join the movement. Share your ride. Sync your journey with
              RideSync.
            </p>
          </div>
        </div>
      </div>

      {/* rating */}
      <div className="bg-[url(../assets/rating.png)] bg-no-repeat bg-center bg-cover min-h-screen">
        <div className="w-full h-full max-w-[1280px] mx-auto flex flex-col justify-center items-center py-20">
          {/* Title with Stars */}
          <div className="flex-col flex justify-center items-center">
            <h1 className="flex justify-center items-center text-3xl font-bold p-2">
              <img src={Star} className="w-8 mx-1" />
              <img src={Star} className="w-8 mx-1" />
              <p className="px-2">Feedback</p>
              <img src={Star} className="w-8 mx-1" />
              <img src={Star} className="w-8 mx-1" />
            </h1>
          </div>

          {/* Feedback Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex justify-center items-center px-4">
            {feedbackList.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="bg-[url(../assets/feedback.png)] bg-cover bg-center bg-no-repeat bg-opacity-90 rounded-2xl shadow-lg text-center w-[300px] h-[300px] mt-10 p-[40px]"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={Hansel}
                    alt="User"
                    className="w-[80px] h-[80px] rounded-full mb-2"
                  />
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-700">{item.message}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Footer */}

      <div className="bg-[#f6a727]">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          {/* Logo Section */}
          <div>
            <img src={Logo} alt="Logo" className="h-24 mb-4" />
            <p className="text-sm">
              © {new Date().getFullYear()} YourCompany. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="/feedback" className="hover:underline">
                  Feedback
                </a>
              </li>
              <li>
                <a href="/login" className="hover:underline">
                  Login
                </a>
              </li>
              <li>
                <a href="/signup" className="hover:underline">
                  Signup
                </a>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="hover:underline">
                  Help / Contact Us
                </a>
              </li>
              <li>
                <a href="/booking" className="hover:underline">
                  Booking
                </a>
              </li>
              <li>
                <a href="/payment" className="hover:underline">
                  Payment
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
