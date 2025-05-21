// import React, { useEffect, useState } from "react";
// import {
//     MapContainer,
//     TileLayer,
//     Marker,
//     Popup,
//     Polyline,
//     useMap,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import axios from "axios";
// import { RxActivityLog } from "react-icons/rx";
// import { FaHome } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import { CgProfile } from "react-icons/cg";
// import Popmsg from "../popup/popup";

// // Helper component to update map center & zoom
// function MapUpdater({ source, destination }) {
//     const map = useMap();

//     useEffect(() => {
//         if (source && destination) {
//             const bounds = [
//                 [source.latitude, source.longitude],
//                 [destination.latitude, destination.longitude],
//             ];
//             map.fitBounds(bounds);
//         }
//     }, [source, destination, map]);

//     return null;
// }

// function DriverHome() {
//     const [userinfo, setUserinfo] = useState([]);
//     const [location, setLocation] = useState(null);
//     const [source, setSource] = useState(null);
//     const [destination, setDestination] = useState(null);
//     const [sourceAddress, setSourceAddress] = useState("");
//     const [destinationAddress, setDestinationAddress] = useState("");
//     const [route, setRoute] = useState([]);
//     const [error, setError] = useState("");
//     const [isOnline, setIsOnline] = useState(false);
//     const [codeInput, setCodeInput] = useState(""); // to store input code
//     const [selectedUserId, setSelectedUserId] = useState(null); // optional: track selected user
//     const [showPopup, setShowPopup] = useState(false);
//     const [color, setColor] = useState("");
//     const [message, setMessage] = useState(" ");

//     const handleCodeSubmit = async (userid) => {
//         if (!codeInput || codeInput.trim() === "") {
//             setMessage("Please enter a valid code.");
//             setColor("red");
//             setShowPopup(true);
//             return;
//         }

//         console.log("Code:", codeInput, "User ID:", userid);


//         try {
//             const response = await axios.post(
//                 "http://localhost:9090/verifycode-driver",
//                 { id: userid, code: codeInput },
//                 {
//                     headers: { "Content-Type": "application/json" },
//                     withCredentials: true,
//                 }
//             );
//             console.log("Response:", response.data);
//             if (response.data.code === 200) {
//                 setUserinfo([]);
//                 setMessage(response.data.message);
//                 setColor("green");
//             } else {
//                 setMessage(response.data.message);
//                 setColor("red");
//             }
//         } catch (error) {
//             setMessage("Server error");
//             setColor("red");
//         }
//         setShowPopup(true);

//     };


//     // Fetch address using OpenStreetMap's Nominatim API
//     const fetchAddress = async (latitude, longitude, setAddress) => {
//         try {
//             const response = await fetch(
//                 `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//             );
//             const data = await response.json();
//             if (data.display_name) {
//                 setAddress(data.display_name);
//             }
//         } catch (error) {
//             console.error("Error fetching address:", error);
//         }
//     };

//     // Get device location with high accuracy
//     useEffect(() => {
//         if ("geolocation" in navigator) {
//             navigator.geolocation.getCurrentPosition(
//                 (pos) => {
//                     console.log("Fetched Coordinates:", pos.coords);
//                     setLocation({
//                         latitude: pos.coords.latitude,
//                         longitude: pos.coords.longitude,
//                     });
//                 },
//                 (err) => {
//                     console.warn("Geolocation failed:", err.message);
//                     setError("Using approximate IP location.");
//                     getIPLocation();
//                 },
//                 {
//                     enableHighAccuracy: true,
//                     timeout: 15000,
//                     maximumAge: 5000,
//                 }
//             );
//         } else {
//             setError("Geolocation not supported.");
//             getIPLocation();
//         }
//     }, []);

//     // Get fallback location using IP-based API
//     const getIPLocation = async () => {
//         try {
//             const res = await fetch("https://ipapi.co/json/");
//             const data = await res.json();
//             if (data.latitude && data.longitude) {
//                 setLocation({ latitude: data.latitude, longitude: data.longitude });
//             } else {
//                 setError("Unable to determine location via IP.");
//             }
//         } catch (e) {
//             setError("Failed to get IP location.");
//         }
//     };

//     // Fetch booking data
//     const getBooking = async () => {
//         try {
//             const res = await axios.get("http://localhost:9090/bookinginfodriver", {
//                 headers: { "Content-Type": "application/json" },
//                 withCredentials: true,
//             });

//             const data = res.data;
//             setUserinfo([data]);

//             if (data.fromlatude && data.fromlontatude && data.tolatitude && data.tolontatude) {
//                 setSource({
//                     latitude: parseFloat(data.fromlatude),
//                     longitude: parseFloat(data.fromlontatude),
//                 });

//                 setDestination({
//                     latitude: parseFloat(data.tolatitude),
//                     longitude: parseFloat(data.tolontatude),
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching booking data:", error);
//         }
//     };

//     useEffect(() => {
//         getBooking();
//     }, []);

//     // Periodically fetch booking updates
//     useEffect(() => {
//         const interval = setInterval(() => {
//             getBooking();
//         }, 30000);
//         return () => clearInterval(interval);
//     }, []);

//     // Fetch and update route dynamically
//     useEffect(() => {
//         if (source && destination) {
//             fetchRoute();
//             fetchAddress(source.latitude, source.longitude, setSourceAddress);
//             fetchAddress(destination.latitude, destination.longitude, setDestinationAddress);
//         }
//     }, [source, destination]);

//     const fetchRoute = async () => {
//         if (source && destination) {
//             try {
//                 console.log(
//                     `Fetching route: (${source.latitude}, ${source.longitude}) -> (${destination.latitude}, ${destination.longitude})`
//                 );
//                 const response = await fetch(
//                     `https://router.project-osrm.org/route/v1/driving/${source.longitude},${source.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`
//                 );
//                 const data = await response.json();
//                 if (data.routes.length > 0) {
//                     setRoute(data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 } else {
//                     console.error("No route found");
//                 }
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     return (
//         <div className="py-9">
//             <div>
//                 {showPopup && (
//                     <Popmsg
//                         message={message}
//                         color={color}
//                         duration={3000}
//                         onClose={() => setShowPopup(false)}
//                     />
//                 )}
//             </div>
//             <div className="container max-w-[1280px] mx-auto flex justify-center items-center gap-6 h-[650px]">
//                 <div className="w-[5%] rounded-lg shadow h-[400px] flex flex-col gap-6 justify-center items-center font-bold">
//                     <button className="text-center font-bold text-xl text-red-500">
//                         <Link to="/driver-home">
//                             <FaHome />
//                         </Link>
//                     </button>
//                     <button className="text-black text-center font-bold text-xl">
//                         <Link to="/booking-details-driver">
//                             <RxActivityLog />
//                         </Link>
//                     </button>
//                     <button className="text-black text-center font-bold text-xl">
//                         <Link to="/driver-profile">
//                             <CgProfile />
//                         </Link>
//                     </button>
//                 </div>

//                 <div className="w-[30%] text-white p-4 rounded-lg  h-[400px]">
//                     <div className="bg-white rounded-md text-sm shadow p-2 text-black flex justify-between items-center">
//                         <h3>Do you want to go online for work?</h3>
//                         <button
//                             onClick={() => setIsOnline(!isOnline)}
//                             className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${isOnline
//                                 ? "bg-green-500 text-white"
//                                 : "bg-gray-300 text-black"
//                                 }`}
//                         >
//                             {isOnline ? "Online" : "Offline"}
//                         </button>
//                     </div>

//                     <div className="max-w-md mx-auto mt-5 space-y-4 text-black">
//                         {userinfo.map((user, idx) => (
//                             <div
//                                 key={idx}
//                                 className="flex flex-col rounded-xl shadow p-4 space-y-2"
//                             >
//                                 <div className="flex items-center">
//                                     <CgProfile className="w-10 h-10 mr-4" />
//                                     <div className="flex flex-col text-sm">
//                                         <h3 className="font-semibold text-lg">{user.Name}</h3>
//                                         <p>Phone: {user.Phone}</p>
//                                         <p>Amount: ₹{user.Amount}</p>
//                                         <p>Kilometers: {user.km}</p>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center space-x-2 pt-3">
//                                     <input
//                                         type="text"
//                                         placeholder="Enter code"
//                                         className="border-2 border-green px-2 py-3 rounded w-full text-sm text-transform uppercase"

//                                         value={selectedUserId === user.id ? codeInput : ""}
//                                         onChange={(e) => {
//                                             setSelectedUserId(user.id);
//                                             setCodeInput(e.target.value);
//                                         }}
//                                         maxLength={6}

//                                     />
//                                     <button
//                                         onClick={() => handleCodeSubmit(user.id)}
//                                         className="bg-green-500 text-white px-3 py-3 rounded text-sm"
//                                     >
//                                         Submit
//                                     </button>
//                                 </div>
//                                 <br></br>
//                                 <div className="rounded-xl  p-5 bg-green-50 pt-3">
//                                     <p className="text-gray-700">
//                                         <span className="font-semibold">From:</span>{" "}
//                                         {user.from || "N/A"}
//                                     </p>
//                                     <p className="text-gray-700">
//                                         <span className="font-semibold">To:</span>{" "}
//                                         {user.to || "N/A"}
//                                     </p>
//                                 </div>

//                             </div>
//                         ))}

//                     </div>
//                 </div>

//                 <div className="w-[50%] bg-white p-4 rounded-lg shadow h-[500px]">
//                     {error && <div className="text-red-600 mb-2">{error}</div>}
//                     {location && destination && source ? (
//                         <MapContainer
//                             center={[location.latitude, location.longitude]}
//                             zoom={13}
//                             style={{ height: "100%", width: "100%" }}
//                         >
//                             <TileLayer
//                                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                                 attribution="&copy; OpenStreetMap contributors"
//                             />
//                             <MapUpdater source={source} destination={destination} />

//                             <Marker position={[source.latitude, source.longitude]}>
//                                 <Popup>
//                                     <strong>Pickup Point:</strong>
//                                     <br />
//                                     {sourceAddress || "Fetching address..."}
//                                 </Popup>
//                             </Marker>
//                             <Marker
//                                 position={[destination.latitude, destination.longitude]}
//                             >
//                                 <Popup>
//                                     <strong>Drop Point:</strong>
//                                     <br />
//                                     {destinationAddress || "Fetching address..."}
//                                 </Popup>
//                             </Marker>

//                             {route.length > 0 && (
//                                 <Polyline
//                                     positions={route}
//                                     pathOptions={{ color: "blue", weight: 4 }}
//                                 />
//                             )}
//                         </MapContainer>
//                     ) : (
//                         <p>Fetching your location and route...</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default DriverHome;
