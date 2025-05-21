import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { RxActivityLog } from "react-icons/rx";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";


import driverIconUrl from '../assets/icondriver.png';
// Helper component to update map center & zoom
function MapUpdater({ source, destination }) {
    const map = useMap();

    useEffect(() => {
        if (source && destination) {
            const bounds = [
                [destination.latitude, destination.longitude],
                [source.latitude, source.longitude],
            ];
            map.fitBounds(bounds);
        }
    }, [destination, source, map]);

    return null;
}


function DriverHome() {
    const [userinfo, setUserinfo] = useState([]);
    const [location, setLocation] = useState(null);
    // const [userlive, setUserlivelocation] = useState(null);
    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState(null);
    const [sourceAddress, setSourceAddress] = useState("");
    const [destinationAddress, setDestinationAddress] = useState("");
    const [route, setRoute] = useState([]);
    const [error, setError] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null); // optional: track selected user
    const [showPopup, setShowPopup] = useState(false);
    const [color, setColor] = useState("");
    const [message, setMessage] = useState(" ");
    const [codeInput, setCodeInput] = useState("");


    const userDivIcon = L.divIcon({
        className: '',
        html: `<div style="
          background-image: url('${driverIconUrl}');
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-size: cover;
        "></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });


    const DriverIcon = L.divIcon({
        className: "pulse-icon",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });


    const handleCodeSubmit = async (userid) => {
        if (!codeInput || codeInput.trim() === "") {
            setMessage("Please enter a valid code.");
            setColor("red");
            setShowPopup(true);
            return;
        }

        console.log("Code:", codeInput, "User ID:", userid);


        try {
            const response = await axios.post(
                "http://localhost:9090/verifycode-driver",
                { id: userid, code: codeInput },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            console.log("Response:", response.data);
            if (response.data.code === 200) {
                setUserinfo([]);
                setMessage(response.data.message);
                setColor("green");
            } else {
                setMessage(response.data.message);
                setColor("red");
            }
        } catch (error) {
            setMessage("Server error");
            setColor("red");
        }
        setShowPopup(true);

    };




    // Fetch address using OpenStreetMap's Nominatim API
    const fetchAddress = async (latitude, longitude, setAddress) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            if (data.display_name) {
                setAddress(data.display_name);
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    // Get device location with high accuracy
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    // console.log("Fetched Coordinates:", pos.coords);
                    setLocation({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    });
                },
                (err) => {
                    console.warn("Geolocation failed:", err.message);
                    setError("Using approximate IP location.");
                    getIPLocation();
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 5000,
                }
            );
        } else {
            setError("Geolocation not supported.");
            getIPLocation();
        }
    }, []);

    // Get fallback location using IP-based API
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




    // Fetch booking data
    const getBooking = async () => {
        try {
            const res = await axios.get("http://localhost:9090/bookinginfodriver", {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            const data = res.data;
            setUserinfo([data]);

            if (data.fromlatude && data.fromlontatude && data.tolatitude && data.tolontatude) {
                setSource({
                    latitude: parseFloat(data.fromlatude),
                    longitude: parseFloat(data.fromlontatude),
                });

                setDestination({
                    latitude: parseFloat(data.tolatitude),
                    longitude: parseFloat(data.tolontatude),
                });


            }
        } catch (error) {
            console.error("Error fetching booking data:", error);
        }
    };

    const updateLiveLocation = async () => {
        try {
            const res = await axios.post(
                "http://localhost:9090/update-driver-live-location",
                {
                    d_latitude: location.latitude,
                    d_longitude: location.longitude,
                },

                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            const data = res.data;
            // console.log(data);;

        } catch (error) {
            console.error("Error fetching booking data:", error);
        }
    };

    useEffect(() => {
        getBooking();
    }, []);

    useEffect(() => {
        if (location?.latitude && location?.longitude) {
            updateLiveLocation();
        }
    }, [location]);

    useEffect(() => {
        if (location?.latitude && location?.longitude) {
            const interval = setInterval(() => {
                updateLiveLocation();
            }, 3000); // 3 seconds

            return () => clearInterval(interval); // Cleanup on unmount
        }
    }, [location]);



    // Periodically fetch booking updates
    useEffect(() => {
        const interval = setInterval(() => {
            getBooking();
            updateLiveLocation();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Fetch and update route dynamically
    useEffect(() => {
        if (source && destination) {
            fetchRoute();
            fetchAddress(source.latitude, source.longitude, setSourceAddress);
            fetchAddress(destination.latitude, destination.longitude, setDestinationAddress);
        }
    }, [source, destination]);

    const fetchRoute = async () => {
        if (source && destination) {
            try {
                console.log(
                    `Fetching route: (${source.latitude}, ${source.longitude}) -> (${destination.latitude}, ${destination.longitude})`
                );
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${source.longitude},${source.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`
                );
                const data = await response.json();
                if (data.routes.length > 0) {
                    setRoute(data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
                } else {
                    console.error("No route found");
                }
            } catch (error) {
                console.error("Error fetching route:", error);
            }
        }
    };

    return (
        <div className="relative w-full h-[100vh] overflow-hidden">
            {/* Full-screen map */}
            <div className="absolute inset-0 z-0">
                {error && <div className="text-red-600">{error}</div>}
                {location && destination && source ? (
                    <MapContainer
                        center={[location.latitude, location.longitude]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                        className="z-0"
                    >
                        <TileLayer
                            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                            // stamen_toner
                            // alidade_smooth
                            // alidade_smooth_dark
                            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                        />
                        <MapUpdater source={source} destination={destination} />

                        <Marker position={[source.latitude, source.longitude]}>
                            <Popup>
                                <strong>Pickup Point:</strong>
                                <br />
                                {sourceAddress || "Fetching address..."}
                            </Popup>
                        </Marker>
                        <Marker
                            position={[destination.latitude, destination.longitude]}
                            style={{ zIndex: 100 }}
                        >
                            <Popup>
                                <strong>Drop Point:</strong>
                                <br />
                                {destinationAddress || "Fetching address..."}
                            </Popup>
                        </Marker>

                        <Marker
                            position={[location.latitude, location.longitude]}
                            icon={userDivIcon}
                        />

                        {userinfo.map(
                            (user) =>
                                user.u_lattitude !== undefined &&
                                user.u_lontitude !== undefined && (
                                    <Marker
                                        key={user.id} // Always include a key when mapping
                                        position={[user.u_lattitude, user.u_lontitude]}
                                        icon={DriverIcon}
                                    />
                                )
                        )}

                        {route.length > 0 && (
                            <Polyline
                                positions={route}
                                pathOptions={{ color: "blue", weight: 4 }}
                            />
                        )}
                    </MapContainer>
                ) : (
                    <div className="text-white text-lg p-6 flex justify-center items-center">
                        Fetching location and route...
                    </div>
                )}
            </div>

            {/* Floating content box */}
            <div className="absolute top-12 right-6 w-[350px] md:w-[400px] bg-white/90 backdrop-blur rounded-xl shadow-2xl p-6 z-10 mt-10">
                {/* Navigation icons */}
                <div className="flex justify-between mb-6 text-xl text-gray-800">
                    <Link to="/driver-home" title="Home">
                        <FaHome className="hover:text-red-500 text-red-500" />
                    </Link>
                    <Link to="/driver-booking-details" title="Bookings">
                        <RxActivityLog className="hover:text-red-500" />
                    </Link>
                    <Link to="/driver-profile" title="Profile">
                        <CgProfile className="hover:text-red-500" />
                    </Link>
                </div>

                {/* Booking/user info */}
                <div className="space-y-4">
                    {userinfo.length === 0 ? (
                        <div className="text-center p-4 rounded-xl bg-red-100 text-red-700 font-semibold shadow flex justify-center items-center">
                            You have not booked yet. Please book.
                        </div>
                    ) : (
                        userinfo.map((user, idx) => (
                            <div key={idx} className="space-y-4">
                                {/* <div className="w-100 h-10"></div> */}
                                <div className="flex items-center rounded-xl shadow-md p-4 bg-white">
                                    <CgProfile className="w-10 h-10 mr-4 text-gray-700" />
                                    <div className="text-sm">
                                        <h3 className="font-semibold text-lg">{user.Name}</h3>
                                        <p className="text-gray-600">Phone: {user.Phone}</p>
                                        <p className="text-gray-600">Amount: ₹{user.Amount}</p>
                                        <p className="text-gray-600">Kilometers: {user.km}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-3">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        className="border-2 border-green px-2 py-3 rounded w-full text-sm text-transform uppercase"
                                        value={selectedUserId === user.id ? codeInput : ""}
                                        onChange={(e) => {
                                            setSelectedUserId(user.id);
                                            setCodeInput(e.target.value);
                                        }}
                                        maxLength={6}
                                    />
                                    <button
                                        onClick={() => handleCodeSubmit(user.id)}
                                        className="bg-green-500 text-white px-3 py-3 rounded text-sm"
                                    >
                                        Submit
                                    </button>
                                </div>

                                {/* <div className="rounded-xl shadow-md p-4 bg-blue-50">
                                    <h3 className="font-semibold text-blue-800">
                                        Code: {user.code}
                                    </h3>
                                </div> */}

                                <div className="rounded-xl shadow-md p-4 bg-green-50 text-gray-700 text-sm">
                                    <p>
                                        <span className="font-semibold">From:</span>{" "}
                                        {sourceAddress || "N/A"}
                                    </p>
                                    <br></br>
                                    <p>
                                        <span className="font-semibold">To:</span>{" "}
                                        {destinationAddress || "N/A"}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

}

export default DriverHome;
