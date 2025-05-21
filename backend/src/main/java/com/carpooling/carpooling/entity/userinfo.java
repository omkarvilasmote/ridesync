package com.carpooling.carpooling.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
public class userinfo {



	@Id
	@Column(updatable = true, nullable = false)
	private int id;

	private String name;

	private String state;

	private String city;

	private String address;

	private long pincode;

	@CreationTimestamp
	private LocalDateTime registrationtime;

	public LocalDateTime getRegistrationtime() {
		return registrationtime;
	}

	public void setRegistrationtime(LocalDateTime registrationtime) {
		this.registrationtime = registrationtime;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getState() {
		return state;
	}


	public void setState(String state) {
		this.state = state;
	}


	public String getCity() {
		return city;
	}


	public void setCity(String city) {
		this.city = city;
	}


	public String getAddress() {return address;}

	public void setAddress(String address) {this.address = address;}

	public long getPincode() {
		return pincode;
	}


	public void setPincode(long pincode) {
		this.pincode = pincode;
	}

//	public signup getSignup() {
//		return signup;
//	}
//	public void setSignup(signup signup) {
//		this.signup = signup;
//	}
}
