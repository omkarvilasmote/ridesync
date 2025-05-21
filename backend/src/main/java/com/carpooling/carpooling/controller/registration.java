package com.carpooling.carpooling.controller;

import com.carpooling.carpooling.entity.Driver;
import com.carpooling.carpooling.entity.Vehicledetails;
import com.carpooling.carpooling.entity.userinfo;
import com.carpooling.carpooling.service.registraionservice;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class registration {

    @Autowired
    private registraionservice registraionservice;


//    User Registration
    @PostMapping("/registration-user")
    public ResponseEntity<Map<String, Object>> registraion(@RequestBody userinfo Userinfo, HttpServletRequest request){
        return registraionservice.registrationUser(Userinfo,request);
    }

    @PostMapping("/registration-driver")
    public ResponseEntity<Map<String, Object>> registrationDriver(@RequestBody Driver driver, HttpServletRequest request){
        return registraionservice.driverRegi(driver,request);
    }

    @PostMapping("/registration-vehicle")
    public String vehicleRegistraion(@RequestBody Vehicledetails vehicledetails, HttpServletRequest request){
        return registraionservice.vechileDetail(vehicledetails,request);
    }
}
