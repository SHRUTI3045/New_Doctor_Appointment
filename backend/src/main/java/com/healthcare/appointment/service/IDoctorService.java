package com.healthcare.appointment.service;

import com.healthcare.appointment.entity.AvailabilityDates;
import com.healthcare.appointment.entity.Doctor;

import java.util.List;

public interface IDoctorService {
    Doctor addDoctor(Doctor bean);
    Doctor updateDoctorProfile(Doctor bean);
    AvailabilityDates addAvailability(AvailabilityDates bean);
    AvailabilityDates updateAvailability(AvailabilityDates bean);
    Doctor getDoctor(int doctorId);
    void removeDoctor(int doctorId);
    List<Doctor> getDoctorList();
    List<Doctor> getDoctorListBySpeciality(String speciality);
    Doctor getDoctorByUserId(int userId);
}
