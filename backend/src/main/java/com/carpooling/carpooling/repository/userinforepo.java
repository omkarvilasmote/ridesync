package com.carpooling.carpooling.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carpooling.carpooling.entity.userinfo;

public interface userinforepo extends JpaRepository<userinfo, Integer> {

}
