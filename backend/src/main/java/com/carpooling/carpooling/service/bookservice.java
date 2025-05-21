package com.carpooling.carpooling.service;

import com.carpooling.carpooling.entity.*;
import com.carpooling.carpooling.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class bookservice {

    @Autowired
    private signuprepo signuprepo;

    @Autowired
    private userinforepo userinforepo;

    @Autowired
    private Driverinforepository driverinforepository;

    @Autowired
    private bookingrepo bookingrepo;


    private final RestTemplate restTemplate = new RestTemplate();

    private final ObjectMapper objectMapper = new ObjectMapper();
    @Autowired
    private vehicledetailrepo vehicledetailrepo;

    // Calculate distance between two points using LocationIQ API
    public float Calculatedistance(double fromlon, double fromlat, double driverlon, double driverlat) {
        String url = "https://us1.locationiq.com/v1/directions/driving/{fromlon},{fromlat};{driverlon},{driverlat}?key=pk.5feda230ecb59b5132c66e8cf7d17f3e&steps=true&alternatives=true&geometries=polyline&overview=full";

        Map<String, Object> uriVariables = new HashMap<>();
        uriVariables.put("fromlon", fromlon);
        uriVariables.put("fromlat", fromlat);
        uriVariables.put("driverlon", driverlon);
        uriVariables.put("driverlat", driverlat);

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class, uriVariables);
            JsonNode root = objectMapper.readTree(response.getBody());
            double distanceMeters = root.path("routes").get(0).path("distance").asDouble();
            return (float) (distanceMeters / 1000.0);
        } catch (Exception e) {
            System.out.println("Distance calculation error: " + e.getMessage());
            return Float.MAX_VALUE; // Fallback large distance
        }
    }


    public float CalculatedistanceUser(double fromlon, double fromlat, double tolon, double tolat) {
        String url = "https://us1.locationiq.com/v1/directions/driving/{fromlon},{fromlat};{tolon},{tolat}?key=pk.5feda230ecb59b5132c66e8cf7d17f3e&steps=true&alternatives=true&geometries=polyline&overview=full";

        Map<String, Object> uriVariables = new HashMap<>();
        uriVariables.put("fromlon", fromlon);
        uriVariables.put("fromlat", fromlat);
        uriVariables.put("tolon", tolon);
        uriVariables.put("tolat", tolat);

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class, uriVariables);
            JsonNode root = objectMapper.readTree(response.getBody());
            double distanceMeters = root.path("routes").get(0).path("distance").asDouble();
            return (float) (distanceMeters / 1000.0); // Convert to kilometers
        } catch (Exception e) {
            System.out.println("Distance calculation error: " + e.getMessage());
            return Float.MAX_VALUE; // Fallback large distance
        }
    }
    public ResponseEntity<Map<String, Object>> SearchVehicle(double fromlon, double fromlat, double tolon, double tolat, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        String id = null;

        // Read user ID from cookie
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
            response.put("message", "User ID cookie missing");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        int userId;
        try {
            userId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            response.put("message", "Invalid ID format");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        signup s = signuprepo.findById(userId).orElse(null);
        userinfo u = userinforepo.findById(userId).orElse(null);

        if (s == null || u == null || !"User".equalsIgnoreCase(s.getRole())) {
            response.put("message", "Invalid user role or info not found");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        List<Driver> drivers = driverinforepository.findAll();
        boolean driverFound = false;

        for (Driver d : drivers) {
            int ids2 = d.getId();
            Vehicledetails vehicledetails = vehicledetailrepo.findById(ids2).orElse(null);
//            Activate account and verified
            if (!d.isIsactive() && !d.isIsverified()) {
                try {
                    double driverlon = Double.parseDouble(d.getLongitude());
                    double driverlat = Double.parseDouble(d.getLatitude());

// Calculate distances
                    float distance1 = Calculatedistance(fromlon, fromlat, driverlon, driverlat);
                    float distance = Math.round(distance1 * 100.0f) / 100.0f;
                    float distanceUser1 = CalculatedistanceUser(fromlon, fromlat, tolon, tolat);
                    float distanceUser = Math.round(distanceUser1 * 100.0f) / 100.0f;

// Total distance in KM
//                    float totalKM = distance + distanceUser;
//                    System.out.println("Total distance: " + totalKM + " KM");



                    float price1 = (float) (distanceUser * 13.5);
                    float price = Math.round(price1 * 100.0f) / 100.0f;
                    System.out.println("Total price: " + price);
                    System.out.println("Driver ID: " + distance);
                    if (distance <= 500.0f) {
                        driverFound = true;
                        response.put("driverid", d.getId());
                        response.put("DriverName", d.getDrivername());
                        response.put("Experience", d.getDrivingexperienceyears());
                        response.put("Gender", d.getGender());
                        response.put("DistanceFromUserToDriverKm", distance);
                        response.put("DistanceFromDriverToDriverKm", distanceUser);
                        response.put("price", price);
                        response.put("capacity",vehicledetails.getCapacity());
                        response.put("totalkm",distanceUser);

                        break;
                    }
                } catch (Exception e) {
                    System.out.println("Driver data parse error: " + e.getMessage());
                }
            }
        }

        if (!driverFound) {
            response.put("message", "No driver found within 5 KM");
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }



//    Booking do and save the data

    public String GenCode() {
        String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder code = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < 6; i++) {
            int index = random.nextInt(alphabet.length());
            code.append(alphabet.charAt(index));
        }

        return code.toString();
    }

    public ResponseEntity<Map<String, Object>> book(bookingEntity bookingEntity, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        String id = null;

        // Read user ID from cookie
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
            response.put("message", "User ID cookie missing");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        int userId;
        try {
            userId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            response.put("message", "Invalid ID format");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Get all bookings for this user
        List<bookingEntity> existingBookings = bookingrepo.findAllByUserid(userId);
        boolean canBook = true;

        for (bookingEntity existing : existingBookings) {
            if (!existing.isStatus()) {  // if any booking is not complete (false), block new booking
                canBook = false;
                break;
            }
        }

        if (!canBook) {
            response.put("message", "Previous booking still pending Your amount soon refund you");
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            return ResponseEntity.ok(response);
        }

        // All previous bookings are complete, allow new booking
        String code = GenCode();
        bookingEntity.setUserid(userId);
        bookingEntity.setCode(code);
        bookingrepo.save(bookingEntity);

        response.put("code", 200);
        response.put("message", "Booking confirmed");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    //    booking info
    public ResponseEntity<Map<String, Object>> BookingInfoDriver(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();

        String id = null;

        // Read user ID from cookie
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
            response.put("message", "User ID cookie missing");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        int userId;
        try {
            userId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            response.put("message", "Invalid ID format");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Get all bookings for this user
        List<bookingEntity> existingBookings = bookingrepo.findAllByDriverid(userId);
        boolean canBook = true;

        for (bookingEntity existing : existingBookings) {
            if (!existing.isStatus()) {  // if any booking is not complete (false), block new booking
                canBook = false;
               int user =  existing.getUserid();
               signup s = signuprepo.findById(user).orElse(null);
               userinfo userinfo = userinforepo.findById(user).orElse(null);
               if (s != null) {
                   response.put("id", existing.getId());
                   response.put("Phone",s.getPhone());
                   response.put("Name",userinfo.getName());
                   response.put("fromlontatude",existing.getFromlontatude());
                   response.put("fromlatude",existing.getFromlatude());
                   response.put("tolontatude",existing.getTolontatude());
                   response.put("tolatitude",existing.getTolatitude());
                   response.put("km",existing.getTotalkm());
                   response.put("Amount",existing.getPrice());
                   response.put("u_lattitude",existing.getU_lattitude());
                   response.put("u_lontitude",existing.getU_lontitude());
               }
                break;
            }
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


//    Booking info return for user

    public ResponseEntity<Map<String, Object>> BookingInfoUser(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();

        String id = null;

        // Read user ID from cookie
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
            response.put("message", "User ID cookie missing");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        int userId;
        try {
            userId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            response.put("message", "Invalid ID format");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Get all bookings for this user
        List<bookingEntity> existingBookings = bookingrepo.findAllByUserid(userId);
        boolean canBook = true;

        for (bookingEntity existing : existingBookings) {
            if (!existing.isStatus()) {  // if any booking is not complete (false), block new booking
                canBook = false;
                int user =  existing.getDriverid();
                signup s = signuprepo.findById(user).orElse(null);
                Driver d = driverinforepository.findById(user).orElse(null);
                if (s != null) {
                    response.put("Phone",s.getPhone());
                    response.put("Name",d.getDrivername());
                    response.put("fromlontatude",existing.getFromlontatude());
                    response.put("fromlatude",existing.getFromlatude());
                    response.put("tolontatude",existing.getTolontatude());
                    response.put("tolatitude",existing.getTolatitude());
                    response.put("km",existing.getTotalkm());
                    response.put("Amount",existing.getPrice());
                    response.put("code",existing.getCode());
                    response.put("d_latitude",existing.getD_latitude());
                    response.put("d_longitude",existing.getD_longitude());
                }
                break;
            }
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }



//    User booking details

    public ResponseEntity<List<Map<String, Object>>> BookingInfo(HttpServletRequest request) {
        List<Map<String, Object>> responseList = new ArrayList<>();

        String id = null;

        // Read user ID from cookie
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        int userId;
        try {
            userId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        // Get all bookings for this user
        List<bookingEntity> existingBookings = bookingrepo.findAllByUserid(userId);

        for (bookingEntity existing : existingBookings) {
            if (existing.isStatus()) {  // if booking is active
                int driverId = existing.getDriverid();
                signup s = signuprepo.findById(driverId).orElse(null);
                Driver d = driverinforepository.findById(driverId).orElse(null);
                if (d != null) {
                    Map<String, Object> bookingData = new HashMap<>();
                    bookingData.put("id", existing.getId());
                    bookingData.put("Name", d.getDrivername());
                    bookingData.put("fromlontatude", existing.getFromlontatude());
                    bookingData.put("fromlatude", existing.getFromlatude());
                    bookingData.put("tolontatude", existing.getTolontatude());
                    bookingData.put("tolatitude", existing.getTolatitude());
                    bookingData.put("km", existing.getTotalkm());
                    bookingData.put("Amount", existing.getPrice());
                    bookingData.put("code", existing.getCode());
                    responseList.add(bookingData);
                }
            }
        }

        return ResponseEntity.ok(responseList);
    }


//    Booking data Driver

    public ResponseEntity <List<Map<String,Object>>> BoookingDataDriver(HttpServletRequest request) {
        List<Map<String, Object>> responseList = new ArrayList<>();

        String id = null;

        // Read user ID from cookie
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        int userId;
        try {
            userId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        // Get all bookings for this user
        List<bookingEntity> existingBookings = bookingrepo.findAllByDriverid(userId);

        for (bookingEntity existing : existingBookings) {
            if (existing.isStatus()) {  // if booking is active
                int userid = existing.getUserid();
                int driverId = existing.getDriverid();
                userinfo u = userinforepo.findById(userid).orElse(null);
                Driver d = driverinforepository.findById(driverId).orElse(null);

                if (d != null) {
                        float finalPrice = Float.parseFloat(existing.getPrice());
                        Map<String, Object> bookingData = new HashMap<>();
                        bookingData.put("id", existing.getId());
                        bookingData.put("Name", u.getName());
                        bookingData.put("fromlontatude", existing.getFromlontatude());
                        bookingData.put("fromlatude", existing.getFromlatude());
                        bookingData.put("tolontatude", existing.getTolontatude());
                        bookingData.put("tolatitude", existing.getTolatitude());
                        bookingData.put("km", existing.getTotalkm());
                        bookingData.put("Amount", finalPrice - 10);
                        bookingData.put("code", existing.getCode());
                        responseList.add(bookingData);

                }
            }
        }

        return ResponseEntity.ok(responseList);
    }



//    code verify logic
public ResponseEntity<Map<String, Object>> VerifyCode(bookingEntity bookingEntity1 ,HttpServletRequest request) {

    Map<String, Object> response = new HashMap<>();


    String id = null;

    // Read user ID from cookie
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
        response.put("message", "User ID cookie missing");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    int userId;
    try {
        userId = Integer.parseInt(id);
    } catch (NumberFormatException e) {
        response.put("message", "Invalid ID format");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }


    List<bookingEntity> existingBookings = bookingrepo.findAllByDriverid(userId);
    boolean canBook = true;
//System.out.println("bookingEntity1.getId()"+bookingEntity1.getId());

    for (bookingEntity existing : existingBookings) {
//        System.out.println("bookingEntity1.getId()"+bookingEntity1.getId());
        if (existing.getId()  == bookingEntity1.getId()) {
//System.out.println("existing.getId()"+existing.getId());
            String providedCode = bookingEntity1.getCode();
            String actualCode = existing.getCode();

            if (providedCode != null && providedCode.equals(actualCode)) {
//                System.out.println("existing.getId()"+existing.isStatus());
                existing.setStatus(true);
                bookingrepo.save(existing);
                response.put("code",200);
                response.put("message", "Ride successfully completed");
            } else {
                response.put("message", "Code is wrong, failed");
            }
            break;
        }
    }

    return new ResponseEntity<>(response, HttpStatus.OK);
}


//Update user live location
    public ResponseEntity<Map<String, Object>> UpdateUserLiveLocation(bookingEntity bookingEntity,HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();

        String id = null;

        // Read user ID from cookie
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
            response.put("message", "User ID cookie missing");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        int userId;
        try {
            userId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            response.put("message", "Invalid ID format");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Get all bookings for this user
        List<bookingEntity> existingBookings = bookingrepo.findAllByUserid(userId);
        boolean canBook = true;

        for (bookingEntity existing : existingBookings) {
            if (!existing.isStatus()) {  // if any booking is not complete (false), block new booking
                canBook = false;
                int user =  existing.getDriverid();
                signup s = signuprepo.findById(user).orElse(null);
                Driver d = driverinforepository.findById(user).orElse(null);
                if (bookingEntity.getU_lattitude() != null && bookingEntity.getU_lontitude() != null) {
                    existing.setU_lattitude(bookingEntity.getU_lattitude());
                    existing.setU_lontitude(bookingEntity.getU_lontitude());
                    bookingrepo.save(existing);
                    response.put("message", "updated successfully");
                } else {
                    response.put("message", "data Not resived ");
                }
                break;
            }
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


//    update live location Driver
    public ResponseEntity<Map<String, Object>> UpdateDriverLiveLocation(bookingEntity bookingEntity,HttpServletRequest request){
        Map<String, Object> response = new HashMap<>();

        String id = null;

        // Read user ID from cookie
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
            response.put("message", "User ID cookie missing");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        int userId;
        try {
            userId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            response.put("message", "Invalid ID format");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Get all bookings for this user
        List<bookingEntity> existingBookings = bookingrepo.findAllByDriverid(userId);
        boolean canBook = true;

        for (bookingEntity existing : existingBookings) {
            if (!existing.isStatus()) {  // if any booking is not complete (false), block new booking
                canBook = false;
                int user =  existing.getUserid();
                int driverid = existing.getDriverid();
                signup s = signuprepo.findById(user).orElse(null);
                userinfo userinfo = userinforepo.findById(user).orElse(null);
                Driver d = driverinforepository.findById(driverid).orElse(null);
                if (bookingEntity.getD_latitude() != null && bookingEntity.getD_longitude() != null) {
                    if(d != null){
//                        System.out.println(bookingEntity.getD_latitude());
//                        System.out.println(bookingEntity.getD_longitude());
                        d.setLatitude(bookingEntity.getD_latitude());
                        d.setLongitude(bookingEntity.getD_longitude());
                        driverinforepository.save(d);
                    }
                    existing.setD_latitude(bookingEntity.getD_latitude());
                    existing.setD_longitude(bookingEntity.getD_longitude());
                    bookingrepo.save(existing);
                    response.put("message", "updated successfully");
                } else {
                    response.put("message", "data Not resived ");
                }
                break;
            }
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
