package com.healthcare.appointment.repository;

import com.healthcare.appointment.entity.AvailabilityDates;
import com.healthcare.appointment.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilityDatesRepository extends JpaRepository<AvailabilityDates, Integer> {
    List<AvailabilityDates> findByDoctor(Doctor doctor);
}
