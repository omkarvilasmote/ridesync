
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from "./nav/nav";
import Home from "./pages/home";
import ContactUs from "./pages/contactus";
import Login from "./pages/login";
import Select from "./pages/select";
// import Register from "./pages/register";
import Userregistration from "./user/userregistraion";
import SearchVehicle from "./user/searchvehicle";
import Driverregistration from "./driver/driverregistration";
import Userhome from "./user/userhome";
import Userprofile from "./user/profile";
import Orderdetails from "./user/ordersdetail";
import DriverHome from "./driver/driverhome";
import Vehicleregistration from "./driver/vehicleregistration";
import Driverprofile from "./driver/driverprofile";
import Driverorderdetails from "./driver/driverBooking";
import Feedback from "./user/feedback";




function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/help" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/selectregistration" element={<Select />} />
        <Route path="/user-registration" element={<Userregistration />} />
        <Route path="/driver-registration" element={<Driverregistration />} />
        <Route path="/search-vehicle" element={<SearchVehicle />} />
        <Route path="/driver-home" element={<DriverHome />} />
        <Route path="/user-home" element={<Userhome />} />
        <Route path="/user-profile" element={<Userprofile />} />
        <Route path="/booking-details" element={<Orderdetails />} />
        <Route path="/vehicle-registration" element={<Vehicleregistration />} />
        <Route path="/driver-profile" element={<Driverprofile />} />
        <Route
          path="/driver-booking-details"
          element={<Driverorderdetails />}
        />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );

}

export default App;
