package com.carpooling.carpooling.controller;

import com.carpooling.carpooling.entity.Driver;
import com.carpooling.carpooling.service.driverservice;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class drivercontroller {
    @Autowired
    private driverservice driverservice;

    @PostMapping("/update-driver-location")
    public ResponseEntity<Map<String, Object>> updateDriverLocation(@RequestBody Driver driver, HttpServletRequest request) {
        return driverservice.driverupdatelocation(driver,request);
    }


    @GetMapping("/get-driver-location")
    public ResponseEntity<Map<String, Object>> GetLocation(HttpServletRequest request) {
        return driverservice.GetDriverLocation(request);
    }
}
