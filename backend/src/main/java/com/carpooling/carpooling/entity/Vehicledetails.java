package com.carpooling.carpooling.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
public class Vehicledetails {

    @Id
    private int id;
    private String vehiclenumber;
    private String vehicledetails;
    private String vehiclecolor;
    private String vehiclemodel;
    private String vehicletype;
    private String carinsurance;
    private String capacity;

    @CreationTimestamp
private LocalDateTime registrationdate;

    public String getVehiclenumber() {
        return vehiclenumber;
    }

    public void setVehiclenumber(String vehiclenumber) {
        this.vehiclenumber = vehiclenumber;
    }

    public String getCapacity() {
        return capacity;
    }

    public void setCapacity(String capacity) {
        this.capacity = capacity;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getVehicledetails() {
        return vehicledetails;
    }

    public void setVehicledetails(String vehicledetails) {
        this.vehicledetails = vehicledetails;
    }

    public String getVehiclecolor() {
        return vehiclecolor;
    }

    public void setVehiclecolor(String vehiclecolor) {
        this.vehiclecolor = vehiclecolor;
    }

    public String getVehiclemodel() {
        return vehiclemodel;
    }

    public void setVehiclemodel(String vehiclemodel) {
        this.vehiclemodel = vehiclemodel;
    }

    public String getVehicletype() {
        return vehicletype;
    }

    public void setVehicletype(String vehicletype) {
        this.vehicletype = vehicletype;
    }

    public String getCarinsurance() {
        return carinsurance;
    }

    public void setCarinsurance(String carinsurance) {
        this.carinsurance = carinsurance;
    }


}
