package com.carpooling.carpooling.controller;

import com.carpooling.carpooling.entity.otpdetails;
import com.carpooling.carpooling.entity.userinfo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.carpooling.carpooling.repository.otpdetailsrepo;
import com.carpooling.carpooling.service.signupservice;

import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class signup {


    @Autowired
    private signupservice signupservice;



    @PostMapping("/login")
    public String loginUser(@RequestBody com.carpooling.carpooling.entity.signup signup,HttpServletResponse response) {
        return signupservice.SignupPhone(signup, response);
    }

    @PostMapping("/verify-otp")
    public String verifyotp(@RequestBody otpdetails otpdetail,HttpServletRequest request,HttpServletResponse response) {
        return signupservice.verifyOTP(otpdetail, request,response);
    }


    @PostMapping("/select")
    public String selectRegistration(@RequestBody com.carpooling.carpooling.entity.signup signup, HttpServletRequest request) {
      return  signupservice.selectRegi(signup,request);
    }

    // Select the option user or driver
    @GetMapping("/select-verify")
    public ResponseEntity<Map<String, Object>> selectVerify(HttpServletRequest request) {
        return signupservice.selectVerify(request);
    }

//User Registration data
    @GetMapping("/user-details")
    public ResponseEntity<Map<String, Object>> userDetails(HttpServletRequest request) {
        return signupservice.UserDetails(request);
    }

//    Driver Registration data
    @GetMapping("/driver-details")
    public ResponseEntity<Map<String, Object>> DriverDetails(HttpServletRequest request) {
return signupservice.DriverDetails(request);
    }
//Verify the USer is regiseted or not
    @GetMapping("/user-verify")
    public ResponseEntity<Map<String, Object>> userVerify(HttpServletRequest request) {
return signupservice.UserVerify(request);
    }

//    Driver Registration verify
    @GetMapping("/driver-verify")
    public ResponseEntity<Map<String, Object>> driverVerify(HttpServletRequest request) {
return signupservice.DriverVerify(request);
    }

//    Vehicle Verify
    @GetMapping("/Vehicle-verify")
    public ResponseEntity<Map<String, Object>> VehicleVerify(HttpServletRequest request) {
        return signupservice.vehicleVerify(request);
    }

}
