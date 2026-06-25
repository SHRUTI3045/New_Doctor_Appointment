package com.healthcare.appointment.repository;

import com.healthcare.appointment.entity.Appointment;
import com.healthcare.appointment.entity.Doctor;
import com.healthcare.appointment.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByDoctor(Doctor doctor);
    List<Appointment> findByAppointmentDate(LocalDate date);
    List<Appointment> findByPatient(Patient patient);
}
