package com.carpooling.carpooling.service;

import com.carpooling.carpooling.entity.Driver;
import com.carpooling.carpooling.entity.feedback;
import com.carpooling.carpooling.entity.signup;
import com.carpooling.carpooling.entity.userinfo;
import com.carpooling.carpooling.repository.Driverinforepository;
import com.carpooling.carpooling.repository.feedbackrepo;
import com.carpooling.carpooling.repository.signuprepo;
import com.carpooling.carpooling.repository.userinforepo;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class HomeService {
    @Autowired
    private  signuprepo signuprepo;
    @Autowired
    private userinforepo userinforepo;

    @Autowired
    private Driverinforepository driverinforepository;

    @Autowired
    private feedbackrepo feedbackrepo;

    Map<String, Object> response = new HashMap<>();


    public ResponseEntity<Map<String, Object>> home(HttpServletRequest request) {
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

        int ids = Integer.parseInt(id);

        // Check if both records are present first
        Optional<signup> signupOpt = signuprepo.findById(ids);
        Optional<userinfo> userinfoOpt = userinforepo.findById(ids);
        Optional<Driver> driver = driverinforepository.findById(ids);

        if (signupOpt.isPresent() && userinfoOpt.isPresent() && "User".equals(signupOpt.get().getRole())) {
            response.put("name", userinfoOpt.get().getName());
            response.put("role", signupOpt.get().getRole());
        } else if (signupOpt.isPresent() && driver.isPresent() && "Driver".equals(signupOpt.get().getRole())) {
            response.put("name", driver.get().getDrivername());
            response.put("role", signupOpt.get().getRole());
        } else {
            response.put("name", null);
            response.put("role", null);
        }


        return ResponseEntity.ok(response);
    }



//Feedback
    public ResponseEntity<Map<String, Object>> feedback(feedback Feedback) {
        Map<String, Object> response = new HashMap<>();
        try{
            feedbackrepo.save(Feedback);
            response.put("code",200);
            response.put("message", "Thank your for feedback");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok(response);
    }


//    Get feedback

public ResponseEntity<Map<String, Object>> getFeedback() {
    Map<String, Object> response = new HashMap<>();
    List<feedback> feedbackList = feedbackrepo.findAll(); // fetch all as list
    response.put("feedback", feedbackList);               // put the list into the map
    return ResponseEntity.ok(response);                   // return as JSON
}

}
