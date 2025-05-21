package com.carpooling.carpooling.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.carpooling.carpooling.entity.signup;


public interface signuprepo extends JpaRepository<signup, Integer> {
	 boolean existsByPhone(String phone);
	signup findByPhone(String phone);

}
