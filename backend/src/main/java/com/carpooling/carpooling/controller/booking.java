package com.carpooling.carpooling.controller;

import com.carpooling.carpooling.entity.CoordinatesRequest;
import com.carpooling.carpooling.entity.bookingEntity;
import com.carpooling.carpooling.service.bookservice;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class booking {


    @Autowired
    private bookservice bookservice;


    @PostMapping("/searchVehicle")
    public ResponseEntity<Map<String, Object>> searchVehicle(
            @RequestBody CoordinatesRequest coordinates,
            HttpServletRequest request) {

        double fromlon = coordinates.getFromlon();
        double fromlat = coordinates.getFromlat();
        double tolon = coordinates.getTolon();
        double tolat = coordinates.getTolat();

//        System.out.println("From Lon: " + fromlon);
//        System.out.println("From Lat: " + fromlat);
//        System.out.println("To Lon: " + tolon);
//        System.out.println("To Lat: " + tolat);

        return bookservice.SearchVehicle(fromlon, fromlat, tolon, tolat, request);
    }

    @PostMapping("/booking")
    public ResponseEntity<Map<String, Object>> bookingdata(@RequestBody bookingEntity bookingEntity, HttpServletRequest request) {
        System.out.println(bookingEntity);
        return bookservice.book(bookingEntity,request);
    }


    @GetMapping("/bookinginfodriver")
    public ResponseEntity<Map<String, Object>> getBookingInfo(HttpServletRequest request) {
        return bookservice.BookingInfoDriver(request);
    }


    @GetMapping("/bookingforuser")
    public ResponseEntity<Map<String,Object>> getBookinginfoUser(HttpServletRequest request) {
        return bookservice.BookingInfoUser(request);
    }


    @GetMapping("/user-bookingdsdetails")
    public ResponseEntity<List<Map<String, Object>>> getBookingdetails(HttpServletRequest request) {
        return bookservice.BookingInfo(request);
    }

    @GetMapping("/driver-bookingdsdetails")
    public ResponseEntity<List<Map<String,Object>>> getBookingDetailsDriver(HttpServletRequest request) {
        return bookservice.BoookingDataDriver(request);
    }

    @PostMapping("/verifycode-driver")
    public ResponseEntity<Map<String, Object>> getVerifyCode(@RequestBody bookingEntity bookingEntity1, HttpServletRequest request) {
//        Map<String, Object> response = new HashMap<>();
//        response.put("code", bookingEntity1.getCode());
//        response.put("id", bookingEntity1.getId());

        return bookservice.VerifyCode(bookingEntity1,request);
    }

//    Update live location User
    @PostMapping("/update-user-live-location")
    public ResponseEntity<Map<String, Object>> getUpdateLocationUser(@RequestBody bookingEntity bookingEntity1,HttpServletRequest request) {
        return bookservice.UpdateUserLiveLocation(bookingEntity1,request);
    }

//    Update live location Driver
    @PostMapping("/update-driver-live-location")
    public ResponseEntity<Map<String, Object>> getUpdateDriverLiveLocation(@RequestBody bookingEntity bookingEntity1,HttpServletRequest request) {
//        System.out.println(bookingEntity1.getD_longitude());
//        System.out.println(bookingEntity1.getD_latitude());
        return bookservice.UpdateDriverLiveLocation(bookingEntity1,request);
    }

}

