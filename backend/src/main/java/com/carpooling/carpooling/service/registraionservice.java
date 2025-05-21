package com.carpooling.carpooling.service;

import com.carpooling.carpooling.entity.Driver;
import com.carpooling.carpooling.entity.Vehicledetails;
import com.carpooling.carpooling.entity.signup;
import com.carpooling.carpooling.entity.userinfo;
import com.carpooling.carpooling.repository.Driverinforepository;
import com.carpooling.carpooling.repository.signuprepo;
import com.carpooling.carpooling.repository.userinforepo;
import com.carpooling.carpooling.repository.vehicledetailrepo;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class registraionservice {

    @Autowired
    private userinforepo userinforepo;

    @Autowired
    private Driverinforepository driverinforepository;

    signup signup = new signup();

    @Autowired
    private vehicledetailrepo vehicledetailrepo;
    @Autowired
    private signuprepo signuprepo;


    //    User Registration
    public ResponseEntity<Map<String, Object>> registrationUser(userinfo userInfo, HttpServletRequest request) {
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
            response.put("message", "Invalid ID in cookie");
            return ResponseEntity.ok(response);
        }

        boolean userExists = userinforepo.existsById(ids);
        boolean driverExists = driverinforepository.existsById(ids);

        if (!userExists && !driverExists) {
            Optional<signup> signupOpt = signuprepo.findById(ids);
            if (!signupOpt.isPresent()) {
                response.put("message", "Go to login page and login again");
                return ResponseEntity.ok(response);
            }

            signup signup1 = signupOpt.get();

            if ("User".equals(signup1.getRole())) {
                userInfo.setId(ids);
                userinforepo.save(userInfo);
                response.put("message", "Registration successful we are redirecting on home page");
                response.put("code", 200);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Click the login button and try again");
                return ResponseEntity.ok(response);
            }
        } else {
            response.put("message", "Already user registration was completed");
            return ResponseEntity.ok(response);
        }
    }



    //    Driver Registration
    public ResponseEntity<Map<String, Object>> driverRegi(Driver driver, HttpServletRequest request) {
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

        System.out.println("This is my id" + id);
        if (id == null) {
            response.put("message", "Go to login page and login again");
            return ResponseEntity.ok(response);
        }

        int ids;
        try {
            ids = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            response.put("message", "Invalid ID in cookie");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<signup> signupOpt = signuprepo.findById(ids);
        if (signupOpt.isEmpty()) {
            response.put("message", "User not found. Please log in again.");
            return ResponseEntity.ok(response);
        }

        signup signup1 = signupOpt.get();
        if (!"Driver".equals(signup1.getRole())) {
            response.put("message", "Invalid role. Please log in with a driver account.");
            return ResponseEntity.ok(response);
        }

        // Optional: You might want to skip if already registered
        if (driverinforepository.findById(ids).isPresent()) {
            response.put("message", "Driver already registered.");
            return ResponseEntity.ok(response);
        }

        driver.setId(ids);
        driverinforepository.save(driver);

        response.put("message", "Registration successful, redirecting to home page.");
        response.put("code", 200);
        return ResponseEntity.ok(response);
    }

// Vehicle details registraion
    public String vechileDetail(Vehicledetails vehicledetails,HttpServletRequest request) {
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
            return "Cookies not found";
        }
        int ids = Integer.parseInt(id);
        signup signup1 = signuprepo.findById(ids).orElse(null);
        Driver driver = driverinforepository.findById(ids).orElse(null);
        if (signup1 != null && driver != null) {
            if (signup1.getRole().equals("Driver")) {
                vehicledetails.setId(ids);
                vehicledetailrepo.save(vehicledetails);
                return "Success";
            }else {
                return "Already Exist";
            }
        }
        return null;
    }
}
