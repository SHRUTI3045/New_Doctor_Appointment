package com.healthcare.appointment.repository;

import com.healthcare.appointment.entity.Doctor;
import com.healthcare.appointment.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByDoctor(Doctor doctor);
}
