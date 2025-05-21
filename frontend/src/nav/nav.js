import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../styles/nav.css";
import Logo from "../assets/logo.png";
import Cookies from 'js-cookie';
import axios from 'axios';
import { FiLogOut } from "react-icons/fi";
import { FaUserAlt } from "react-icons/fa";

function Nav() {
  const [user, setUser] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get('http://localhost:9090/VerifyUser', {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        });

        const { name, role } = response.data;
        console.log(response.data);

        if (name && role === "User") {
          setUser(name);
          setRole(role);
        } else if (name && role === "Driver") {
          setUser(name);
          setRole(role);
        } else {
          setUser("");
          setRole("");
        }

      } catch (error) {
        console.error("Error fetching user info:", error);
        setUser("");
        setRole("");
      }
    }

    fetchUser();
  },);

  const logout = async () => {
    try {
      await axios.post('http://localhost:9090/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn("Logout failed, clearing cookies anyway.");
    }

    // Clear all cookies
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach(cookie => Cookies.remove(cookie, { path: '/' }));

    setUser("");
    setRole("");
    navigate("/login");
  };

  return (
    <div className="bg-white text-black p-5 w-full flex justify-between shadow-lg items-center h-20 overflow-hidden fixed top-0 left-0 z-50">
      <img src={Logo} alt="logo" className="h-20 ml-10" />
      <ul className="flex list-none text-[16px] mr-10">
        {(user && role === "User") && (
          <div className="flex items-center justify-center mr-6">
            <li className="mr-6 hover:text-red-500">
              <Link to="/">Home</Link>
            </li>
            <li className="mr-6 hover:text-red-500 cursor-pointer" id="#about">About</li>
            <li className="mr-6 hover:text-red-500">
              <Link to="/help">Help</Link>
            </li>
            <li className="mr-6 hover:text-red-500"><Link to="/Feedback">Feedback</Link></li>
            <li className="mr-6 flex items-center">
              <FaUserAlt className="mr-2" /> {user}
            </li>
            <li>
              <button className="bg-red-400 text-white rounded px-5 mr-2 p-2 hover:bg-red-600">
                <Link to="/user-home">Booking</Link>
              </button>
            </li>
            <li>
              <button
                className="bg-red-400 text-white rounded p-2 hover:bg-red-600 ml-2"
                onClick={logout}
              >
                <FiLogOut />
              </button>
            </li>
          </div>
        )}

        {(user && role === "Driver") && (
          <div className="flex items-center justify-center mr-6">
            <li className="mr-6 hover:text-red-500">
              <Link to="/">Home</Link>
            </li>
            <li className="mr-6 hover:text-red-500">
              <Link to="/help">Help</Link>
            </li>
            <li className="mr-6 flex items-center">
              <FaUserAlt className="mr-2" /> {user}
            </li>
            <li>
              <button className="bg-red-400 text-white rounded px-5 mr-2 p-2 hover:bg-red-600">
                <Link to="/driver-home">Dashboard</Link>
              </button>
            </li>
            <li>
              <button
                className="bg-red-400 text-white rounded p-2 hover:bg-red-600 ml-2"
                onClick={logout}
              >
                <FiLogOut />
              </button>
            </li>
          </div>
        )}

        {(!user || !role) && (
          <div className="flex items-center justify-center mr-6">
            <li className="mr-6 hover:text-red-500">
              <Link to="/">Home</Link>
            </li>
            <li className="mr-6 hover:text-red-500"><a href=".#about">About</a></li>
            <li className="mr-6 hover:text-red-500">
              <Link to="/help">Help</Link>
            </li>
            <li className="mr-6 hover:text-red-500"><Link to="/Feedback">Feedback</Link></li>
            <li>
              <button className="bg-red-400 text-white rounded px-5 p-2 hover:bg-red-600">
                <Link to="/login">Login</Link>
              </button>
            </li>
          </div>

        )}
      </ul>
    </div>
  );
}

export default Nav;
