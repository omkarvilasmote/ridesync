package com.carpooling.carpooling.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "booking")
public class bookingEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int userid;
    private int driverid;
    private String driverName;
    private String fromlontatude;
    private String fromlatude;
    private String tolontatude;
    private String tolatitude;
    private String capacity;
    private String totalkm;
    private String paymentId;
    private String price;
    private boolean payment = true;
    private String bookingstatus = "On the way";
    private String code;
    private String bookingtype = "Online";
    private boolean status = false;
    private String is_allocated = "true";

    private String u_lontitude;
    private String u_lattitude;
    private String d_longitude;
    private String d_latitude;

    @CreationTimestamp
    private LocalDateTime bookingDateTime;

    public LocalDateTime getBookingDateTime() {
        return bookingDateTime;
    }

    public void setBookingDateTime(LocalDateTime bookingDateTime) {
        this.bookingDateTime = bookingDateTime;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getU_lontitude() {
        return u_lontitude;
    }

    public void setU_lontitude(String u_lontitude) {
        this.u_lontitude = u_lontitude;
    }

    public String getU_lattitude() {
        return u_lattitude;
    }

    public void setU_lattitude(String u_lattitude) {
        this.u_lattitude = u_lattitude;
    }

    public String getD_longitude() {
        return d_longitude;
    }

    public void setD_longitude(String d_longitude) {
        this.d_longitude = d_longitude;
    }

    public String getD_latitude() {
        return d_latitude;
    }

    public void setD_latitude(String d_latitude) {
        this.d_latitude = d_latitude;
    }

    public String getTolatitude() {
        return tolatitude;
    }

    public void setTolatitude(String tolatitude) {
        this.tolatitude = tolatitude;
    }

    public String getTotalkm() {
        return totalkm;
    }

    public void setTotalkm(String totalkm) {
        this.totalkm = totalkm;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserid() {
        return userid;
    }

    public void setUserid(int userid) {
        this.userid = userid;
    }

    public int getDriverid() {
        return driverid;
    }

    public void setDriverid(int driverid) {
        this.driverid = driverid;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getFromlontatude() {
        return fromlontatude;
    }

    public void setFromlontatude(String fromlontatude) {
        this.fromlontatude = fromlontatude;
    }

    public String getFromlatude() {
        return fromlatude;
    }

    public void setFromlatude(String fromlatude) {
        this.fromlatude = fromlatude;
    }

    public String getTolontatude() {
        return tolontatude;
    }

    public void setTolontatude(String tolontatude) {
        this.tolontatude = tolontatude;
    }




    public String getCapacity() {
        return capacity;
    }

    public void setCapacity(String capacity) {
        this.capacity = capacity;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public boolean isPayment() {
        return payment;
    }

    public void setPayment(boolean payment) {
        this.payment = payment;
    }

    public String getBookingstatus() {
        return bookingstatus;
    }

    public void setBookingstatus(String bookingstatus) {
        this.bookingstatus = bookingstatus;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getBookingtype() {
        return bookingtype;
    }

    public void setBookingtype(String bookingtype) {
        this.bookingtype = bookingtype;
    }


    public String getIs_allocated() {
        return is_allocated;
    }

    public void setIs_allocated(String is_allocated) {
        this.is_allocated = is_allocated;
    }
}

