package com.carpooling.carpooling.service;

import com.carpooling.carpooling.entity.Driver;
import com.carpooling.carpooling.entity.signup;
import com.carpooling.carpooling.repository.Driverinforepository;
import com.carpooling.carpooling.repository.signuprepo;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class driverservice {
    @Autowired
    private Driverinforepository driverinforepository;

    @Autowired
    private signuprepo signuprepo;

    public ResponseEntity<Map<String, Object>> driverupdatelocation(Driver driver, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        String id = null;

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("id".equals(cookie.getName())) {
                    id = cookie.getValue();
                    break;
                }
            }
        }

        if (id == null) {
            response.put("message", "Missing ID in cookies");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        int ids = Integer.parseInt(id);

        Optional<signup> optionalSignup = signuprepo.findById(ids);
        if (optionalSignup.isEmpty() || !"Driver".equals(optionalSignup.get().getRole())) {
            response.put("message", "Unauthorized or invalid role");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        Optional<Driver> optionalDriver = driverinforepository.findById(ids);
        if (optionalDriver.isPresent()) {
            Driver driverToUpdate = optionalDriver.get();
            driverToUpdate.setLatitude(driver.getLatitude());
            driverToUpdate.setLongitude(driver.getLongitude());
            driverinforepository.save(driverToUpdate);

            response.put("message", "success");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Driver not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }





    public ResponseEntity<Map<String, Object>> GetDriverLocation(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        String id = null;

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("id".equals(cookie.getName())) {
                    id = cookie.getValue();
                    break;
                }
            }
        }

        if (id == null) {
            response.put("message", "something went wrong");
            return ResponseEntity.ok(response);
        }

        int ids;
        try {
            ids = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            response.put("message", "invalid id format");
            return ResponseEntity.ok(response);
        }

        // Fetch driver and signup records
        Optional<Driver> driverOpt = driverinforepository.findById(ids);
        Optional<signup> signupOpt = signuprepo.findById(ids);

        if (driverOpt.isPresent() && signupOpt.isPresent() && "Driver".equals(signupOpt.get().getRole())) {
            Driver driver1 = driverOpt.get();
            response.put("longitude", driver1.getLongitude());
            response.put("latitude", driver1.getLatitude());
        } else {
            response.put("message", "something went wrong 2");
        }

        return ResponseEntity.ok(response);
    }

}
