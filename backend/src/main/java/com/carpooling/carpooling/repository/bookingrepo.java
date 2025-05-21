package com.carpooling.carpooling.repository;


import com.carpooling.carpooling.entity.bookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface bookingrepo extends JpaRepository<bookingEntity, Integer> {
    List<bookingEntity> findAllByUserid(int userId);

    List<bookingEntity> findAllByDriverid(int driverid);
}
