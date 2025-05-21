package com.carpooling.carpooling.entity;

public class CoordinatesRequest {
    private double fromlon;
    private double fromlat;
    private double tolon;
    private double tolat;

    // Getters and Setters
    public double getFromlon() { return fromlon; }
    public void setFromlon(double fromlon) { this.fromlon = fromlon; }

    public double getFromlat() { return fromlat; }
    public void setFromlat(double fromlat) { this.fromlat = fromlat; }

    public double getTolon() { return tolon; }
    public void setTolon(double tolon) { this.tolon = tolon; }

    public double getTolat() { return tolat; }
    public void setTolat(double tolat) { this.tolat = tolat; }
}
