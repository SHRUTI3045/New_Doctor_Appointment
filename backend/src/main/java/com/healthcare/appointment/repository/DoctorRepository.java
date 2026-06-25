package com.healthcare.appointment.repository;

import com.healthcare.appointment.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    List<Doctor> findBySpeciality(String speciality);
    Optional<Doctor> findByEmail(String email);
}
