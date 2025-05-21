package com.carpooling.carpooling.controller;

import com.carpooling.carpooling.entity.feedback;
import com.carpooling.carpooling.service.HomeService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class home {
	@Autowired
	private HomeService homeService;

	@GetMapping("/")
	public String home() {
		return "Its your home";
	}


	@GetMapping("/VerifyUser")
	public ResponseEntity<Map<String,Object>> VerifyUser(HttpServletRequest request) {
		return homeService.home(request);
	}


	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletResponse response) {
		Cookie cookie = new Cookie("id", null);
		cookie.setPath("/");
		cookie.setMaxAge(0);
		response.addCookie(cookie);
		return ResponseEntity.ok("Logged out");
	}


//	Feedback
	@PostMapping("/feedback")
	public ResponseEntity<Map<String,Object>> feedback(@RequestBody feedback Feedback) {
		return homeService.feedback(Feedback);
	}


//	Get feedbacks
	@GetMapping("/get-feedbacks")
	public ResponseEntity<Map<String,Object>> getFeedbacks() {
		return homeService.getFeedback();
	}

}