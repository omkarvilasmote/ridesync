package com.carpooling.carpooling.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
public class Driver {

    @Id
    private int id;

    private String drivername;
    private String adhaarnumber;
    private String pancardnumber;
    private String licencenumber;
    private String rcbook;
    private String gender;
    private int age;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String dob;
    private String maritalstatus;
    private String medicaldetails;
    private String birthmark;

    private int drivingexperienceyears;
    private String emergencycontactnum;
    private String ownimg = "pending";

    private String registrationstatus = "pending";
    // drive can active for ride
    private boolean isactive = false;
    // free available
    private boolean is_available = false;

    private String longitude;
    private String latitude;
    private boolean isverified = false;

    @CreationTimestamp
private LocalDateTime driverregistrationdate;
    public boolean isIs_available() {
        return is_available;
    }

    public void setIs_available(boolean is_available) {
        this.is_available = is_available;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDrivername() {
        return drivername;
    }

    public void setDrivername(String drivername) {
        this.drivername = drivername;
    }

    public String getAdhaarnumber() {
        return adhaarnumber;
    }

    public void setAdhaarnumber(String adhaarnumber) {
        this.adhaarnumber = adhaarnumber;
    }

    public String getPancardnumber() {
        return pancardnumber;
    }

    public void setPancardnumber(String pancardnumber) {
        this.pancardnumber = pancardnumber;
    }

    public String getLicencenumber() {
        return licencenumber;
    }

    public void setLicencenumber(String licencenumber) {
        this.licencenumber = licencenumber;
    }

    public String getRcbook() {
        return rcbook;
    }

    public void setRcbook(String rcbook) {
        this.rcbook = rcbook;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getMaritalstatus() {
        return maritalstatus;
    }

    public void setMaritalstatus(String maritalstatus) {
        this.maritalstatus = maritalstatus;
    }

    public String getMedicaldetails() {
        return medicaldetails;
    }

    public void setMedicaldetails(String medicaldetails) {
        this.medicaldetails = medicaldetails;
    }

    public String getBirthmark() {
        return birthmark;
    }

    public void setBirthmark(String birthmark) {
        this.birthmark = birthmark;
    }

    public boolean isIsverified() {
        return isverified;
    }

    public void setIsverified(boolean isverified) {
        this.isverified = isverified;
    }

    public String getRegistrationstatus() {
        return registrationstatus;
    }

    public void setRegistrationstatus(String registrationstatus) {
        this.registrationstatus = registrationstatus;
    }

    public int getDrivingexperienceyears() {
        return drivingexperienceyears;
    }

    public void setDrivingexperienceyears(int drivingexperienceyears) {
        this.drivingexperienceyears = drivingexperienceyears;
    }

    public String getEmergencycontactnum() {
        return emergencycontactnum;
    }

    public void setEmergencycontactnum(String emergencycontactnum) {
        this.emergencycontactnum = emergencycontactnum;
    }

    public String getOwnimg() {
        return ownimg;
    }

    public void setOwnimg(String ownimg) {
        this.ownimg = ownimg;
    }

    public boolean isIsactive() {
        return isactive;
    }

    public void setIsactive(boolean isactive) {
        this.isactive = isactive;
    }
}
