import { useSearchParams } from "react-router-dom";
import { MdOutlineReduceCapacity } from "react-icons/md";
import { FaUserTie, FaVenusMars, FaRupeeSign, FaRoad } from "react-icons/fa";
import Popupmsg from "../popup/popup";
import { useNavigate } from "react-router-dom";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap
} from "react-leaflet";
import axios from "axios";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "./leaflet.css";

const MapUpdater = ({ bounds }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds);
        }
    }, [bounds, map]);
    return null;
};

const SearchVehicle = () => {
    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState(false);
    const [color, setColor] = useState("");
    const [message, setMessage] = useState(" ");
    const stadiaApiKey = "04bfe7a8-084e-4af2-99d6-47e894ce69f7";
    const [searchParams] = useSearchParams();
    const [location, setLocation] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fromlon = parseFloat(searchParams.get("fromlontitude"));
    const fromlat = parseFloat(searchParams.get("fromlatitude"));
    const tolon = parseFloat(searchParams.get("tolontitude"));
    const tolat = parseFloat(searchParams.get("tolatitude"));

    const bounds = [
        [fromlat, fromlon],
        [tolat, tolon],
    ];


    const getCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setLocation({ latitude, longitude });
                    setError("");
                },
                (err) => {
                    console.warn("Geolocation failed:", err.message);
                    setError("Using approximate IP location.");
                    location.reload();
                    getIPLocation();
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 5000,
                }
            );
        } else {
            setError("Geolocation not supported.");
            getIPLocation();
        }
    };

    const getIPLocation = async () => {
        try {
            const res = await fetch("https://ipapi.co/json/");
            const data = await res.json();
            if (data.latitude && data.longitude) {
                setLocation({ latitude: data.latitude, longitude: data.longitude });
            } else {
                setError("Unable to determine location via IP.");
            }
        } catch (e) {
            setError("Failed to get IP location.");
        }
    };

    const getVehicles = async () => {
        setLoading(true);
        try {
            const res = await axios.post(
                "http://localhost:9090/searchVehicle",
                { fromlon, fromlat, tolon, tolat },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setVehicles(Array.isArray(res.data) ? res.data : [res.data]);
        } catch (err) {
            console.error("API Fetch Error:", err);
            setError("Failed to fetch vehicles.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getVehicles();
    }, [fromlon, fromlat, tolon, tolat]);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    async function paymnetdoAPI(paymentId, item) {
        const res = await axios.post(
            "http://localhost:9090/booking",
            {
                paymentId,
                fromlontatude: fromlon,
                fromlatude: fromlat,
                tolontatude: tolon,
                tolatitude: tolat,
                driverid: item.driverid,
                driverName: item.DriverName,
                capacity: item.capacity,
                totalkm: item.totalkm,
                price: item.price,
            },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        console.log("Payment Response:", res.data);
        if (res.data.code === 200) {
            setColor("green");
            setMessage("Booking Confirmed");
            setShowPopup(true);
            setTimeout(() => navigate('/user-home'), 3000);
        } else {
            setColor("red");
            setMessage(res.data.message);
            setShowPopup(true);
        }

    }

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (item) => {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const options = {
            key: "rzp_test_1driIxtDCy6gNU",
            amount: item.price * 100,
            currency: "INR",
            name: "Your Company",
            description: "Test Transaction",
            handler: function (response) {
                paymnetdoAPI(response.razorpay_payment_id, item);
            },
            prefill: {
                name: "Test User",
                email: "test@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div className="py-10 bg-[url(../assets/searchviehicle.png)] bg-no-repeat bg-cover bg-center">
            {showPopup && (
                <Popupmsg
                    message={message}
                    color={color}
                    duration={3000}
                    onClose={() => setShowPopup(false)}
                />
            )}
            <div className="container max-w-[1280px] mx-auto flex justify-center items-center gap-6 h-[650px]">
                <div className="w-[50%] bg-white p-6 shadow-md h-[400px]">
                    {error && <div className="text-red-600 mb-2">{error}</div>}
                    {location ? (
                        <MapContainer
                            center={[fromlat, fromlon]}
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png${stadiaApiKey ? "?api_key=" + stadiaApiKey : ""
                                    }`}
                                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                            />
                            <MapUpdater bounds={bounds} />
                            <Marker position={[location.latitude, location.longitude]}>
                                <Popup>
                                    Your Location
                                    <br />
                                    Lat: {location.latitude}
                                    <br />
                                    Lon: {location.longitude}
                                </Popup>
                            </Marker>
                            <Marker position={[fromlat, fromlon]}>
                                <Popup>From Location</Popup>
                            </Marker>
                            <Marker position={[tolat, tolon]}>
                                <Popup>To Location</Popup>
                            </Marker>
                            <Polyline
                                positions={[
                                    [fromlat, fromlon],
                                    [tolat, tolon],
                                ]}
                                pathOptions={{ color: "red" }}
                            />
                        </MapContainer>
                    ) : (
                        <p>Fetching your location...</p>
                    )}
                </div>

                <div className="w-full text-white p-4 h-[500px] overflow-y-auto rounded-md">
                    <h2 className="text-lg font-semibold text-center mb-4 text-black">
                        Available Vehicles
                    </h2>

                    {loading ? (
                        <div className="text-black text-center">Loading vehicles...</div>
                    ) : vehicles.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {vehicles.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="w-full p-4 bg-white text-black rounded-lg shadow flex justify-between items-center"
                                >
                                    <div className="flex flex-col gap-2 w-[70%]">
                                        <div className="flex items-center gap-2">
                                            <FaUserTie className="text-red-500" />
                                            <span className="text-lg font-semibold uppercase">
                                                {item.DriverName || "N/A"}
                                            </span>
                                            <MdOutlineReduceCapacity className="text-red-500 text-lg" />
                                            <span className="text-lg font-semibold">
                                                {item.capacity || "N/A"}
                                            </span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-semibold">Experience:</span>{" "}
                                            {item.Experience || "N/A"} yrs
                                            <span className="ml-4 font-semibold">Gender:</span>{" "}
                                            {item.Gender || "N/A"}
                                        </div>
                                        <div className="text-sm flex items-center gap-2">
                                            <FaRoad className="text-gray-500" />
                                            <span>
                                                Total Distance: {item.totalkm} km
                                            </span>
                                        </div>
                                        <div className="text-sm flex items-center gap-2">
                                            <FaRupeeSign className="text-green-600" />
                                            <span>Charge: ₹{item.price || "0"}</span>
                                        </div>
                                    </div>

                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                                        onClick={() => handlePayment(item)}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-black text-center">No vehicles found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchVehicle;
