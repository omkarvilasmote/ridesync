package com.carpooling.carpooling.repository;


import com.carpooling.carpooling.entity.feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface feedbackrepo extends JpaRepository<feedback, Integer> {
}
