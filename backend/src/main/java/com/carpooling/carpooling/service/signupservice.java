package com.carpooling.carpooling.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import com.carpooling.carpooling.entity.*;
import com.carpooling.carpooling.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;


@Service
public class signupservice {

	@Autowired
	private signuprepo signupuser;
	@Autowired
	private RestTemplate restTemplate;
	@Autowired
	private otpdetailsrepo otpdetailsrep;



	@Autowired
	private signuprepo signuprepo;
    @Autowired
    private userinforepo userinforepo;

	@Autowired
	private Driverinforepository driverinforepository;
    @Autowired
    private vehicledetailrepo vehicledetailrepo;

	@Value("${twilio.account.sid}")
	private String accountSid;

	@Value("${twilio.auth.token}")
	private String authToken;

	@Value("${twilio.phone.number}")
	private String fromPhoneNumber;


	public void sendOtpMessage(String phoneNumber, String otp) {
		// Initialize Twilio client
		Twilio.init(accountSid, authToken);

		// Ensure phoneNumber starts with "+" and country code (e.g., +91 for India)
		if (!phoneNumber.startsWith("+")) {
			phoneNumber = "+91" + phoneNumber; // Adjust country code as needed
		}

		// Create the message body
		String messageBody = "Your OTP is: " + otp;

		// Send the SMS
		Message.creator(
				new PhoneNumber(phoneNumber), // To number
				new PhoneNumber(fromPhoneNumber), // From Twilio number
				messageBody
		).create();
	}


	public int getRandomNumber() {
		Random random = new Random(); // Ensure random is defined
		int otp = 100000 + random.nextInt(900000); // 100000 to 999999
		return otp;
	}


//  Add cookie
public String addCookie1(HttpServletResponse response, String value) {
	Cookie cookie = new Cookie("temp", value);
	cookie.setPath("/"); // Make cookie available to entire app
	cookie.setHttpOnly(true); // Optional: protects from JavaScript access
	cookie.setMaxAge(7 * 24 * 60 * 60);
	cookie.setSecure(false);
	response.addCookie(cookie);
	return "Successfully stored cookies";
}


	public String addCookie(HttpServletResponse response, String value) {
		Cookie cookie = new Cookie("id", value);
       cookie.setPath("/"); // Make cookie available to entire app
		cookie.setHttpOnly(true); // Optional: protects from JavaScript access
		cookie.setMaxAge(7 * 24 * 60 * 60);
		cookie.setSecure(false);
		response.addCookie(cookie);
		return "Successfully stored cookies";
	}

	//	Login
	public String SignupPhone(signup Signup, HttpServletResponse response) {
		if (!signupuser.existsByPhone(Signup.getPhone())) {
			try {
				signupuser.save(Signup);
				int cust_id = Signup.getId(); // ID should now be available after save
				addCookie1(response, String.valueOf(cust_id));
				return "Successfully signed up";

			} catch (Exception e) {
				return "Error during signup: " + e.getMessage();
			}
		} else {
			// Fetch existing user from database to get correct ID
			signup signup = signupuser.findByPhone(Signup.getPhone());
			int cust_id = signup.getId();
			addCookie1(response, String.valueOf(cust_id));
			return "Already Registered";
		}


//		return null;

	}


	//	verify the OTP
	public String verifyOTP(otpdetails Otpdetail, HttpServletRequest request,HttpServletResponse response) {
		String id = null;
		Cookie[] cookies = request.getCookies();

		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if ("temp".equals(cookie.getName())) {
					id = cookie.getValue();
					break;
				}
			}
		}

		if (id == null) {
			return "Cookies not found";
		}

		int userId = Integer.parseInt(id);
		otpdetails existingOtp = otpdetailsrep.findById(userId).orElse(null);
		signup signup1 = signuprepo.findById(existingOtp.getId()).orElse(null);
		LocalDateTime now = LocalDateTime.now();
		int newOtp = getRandomNumber();
//		sendOtpMessage(signup1.getPhone(), String.valueOf(newOtp));
		LocalDateTime expiryTime = now.plusMinutes(2);

		if (existingOtp != null) {
			if (now.isAfter(existingOtp.getUpdatedAt())) {
				// Expired - update OTP
				existingOtp.setOtp(newOtp);
				existingOtp.setUpdatedAt(expiryTime);
				otpdetailsrep.save(existingOtp);
				sendOtpMessage(signup1.getPhone(), String.valueOf(newOtp));
				return "New Updated OTP Updated";
			} else {
				// Still valid - verify
				if (Otpdetail.getOtp() == existingOtp.getOtp()) {
					// OTP verified successfully, add cookie to browser
					addCookie(response, String.valueOf(userId));
					return "OTP is Verified and valid";
				} else {
					return "Please check OTP and try again";
				}
			}
		} else {
			signup signup3 = signuprepo.findById(userId).orElse(null);

			// First-time OTP creation
			Otpdetail.setId(userId);
			Otpdetail.setOtp(newOtp);
			Otpdetail.setCreatedAt(now);
			Otpdetail.setUpdatedAt(expiryTime);
			otpdetailsrep.save(Otpdetail);
			sendOtpMessage(signup3.getPhone(), String.valueOf(newOtp));
			// Optionally add cookie after saving new OTP
			addCookie(response, String.valueOf(userId));
			return "New ID and OTP added";
		}
	}

//	select Registration
	public String selectRegi(signup signup, HttpServletRequest request) {
		System.out.println(signup.getRole());
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
			return "Cookie not found";
		}else{
			int ids = Integer.parseInt(id);
			signup signup1 = signupuser.findById(ids).orElse(null);
			if(signup.getRole() != null){
				signup1.setRole(signup.getRole());
				signupuser.save(signup1);
				return "Success";
			}
		}
        return null;
    }


	// select verify

	public ResponseEntity<Map<String, Object>> selectVerify(HttpServletRequest request) {
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
		int ids = Integer.parseInt(id);
		signup signup2 = signupuser.findById(ids).orElse(null);
		if (signup2.getRole()==null){
			response.put("status", "User not found");
		}else {
			response.put("status", "Success");
			response.put("role", signup2.getRole());
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}


//	verify the user is registerd
	public ResponseEntity<Map<String,Object>> UserVerify(HttpServletRequest request) {
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
		int ids = Integer.parseInt(id);
		signup signup2 = signupuser.findById(ids).orElse(null);
		if (Objects.equals(signup2.getRole(), "User")){
			userinfo userinfo = userinforepo.findById(ids).orElse(null);
			if (userinfo != null) {
				response.put("status", "Success");
			}

		}else {
			response.put("status", "Something went wrong");
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}


//	Driver is registred verify

	public ResponseEntity<Map<String,Object>> DriverVerify(HttpServletRequest request) {
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
		int ids = Integer.parseInt(id);
		signup signup2 = signupuser.findById(ids).orElse(null);
		if (Objects.equals(signup2.getRole(), "Driver")){
			Driver driver = driverinforepository.findById(ids).orElse(null);
			if (driver != null) {
				response.put("status", "Success");
			}
		}else {
			response.put("status", "Something went wrong");
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

//	Vehicle Verify
	public ResponseEntity <Map<String ,Object>> vehicleVerify(HttpServletRequest request) {
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
		int ids = Integer.parseInt(id);
		signup signup2 = signupuser.findById(ids).orElse(null);
		System.out.println(signup2.getRole());;

		if (Objects.equals(signup2.getRole(), "Driver")){
			Driver driver = driverinforepository.findById(ids).orElse(null);
			Vehicledetails vehicledetails = vehicledetailrepo.findById(ids).orElse(null);
			if (driver != null && vehicledetails != null) {
				response.put("status", "Success");
			}if(driver == null){
				response.put("status", "Driver not found");
			}
		}else {
			response.put("status", "Something went wrong");
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}


	public ResponseEntity<Map<String, Object>> UserDetails(HttpServletRequest request) {
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
			response.put("status", "error");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}
		int ids = Integer.parseInt(id);

		userinfo u = userinforepo.findById(ids).orElse(null);
		if (u != null) {
			response.put("data", u);
			return ResponseEntity.ok(response);
		}else {
			response.put("messsage","User not found" );
			return ResponseEntity.ok(response);
		}
	}

    public ResponseEntity <Map<String ,Object>> DriverDetails(HttpServletRequest request) {
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
            response.put("status", "error");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        int ids = Integer.parseInt(id);

        Driver driver = driverinforepository.findById(ids).orElse(null);
        if (driver != null) {
            response.put("data", driver);
            return ResponseEntity.ok(response);
        }else {
            response.put("messsage","User not found" );
            return ResponseEntity.ok(response);
        }

    }


}



