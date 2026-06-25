package com.healthcare.appointment.service.impl;

import com.healthcare.appointment.entity.AvailabilityDates;
import com.healthcare.appointment.entity.Doctor;
import com.healthcare.appointment.repository.AvailabilityDatesRepository;
import com.healthcare.appointment.repository.DoctorRepository;
import com.healthcare.appointment.service.IDoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements IDoctorService {

    private final DoctorRepository doctorRepository;
    private final AvailabilityDatesRepository availabilityDatesRepository;

    @Override
    public Doctor addDoctor(Doctor bean) {
        return doctorRepository.save(bean);
    }

    @Override
    public Doctor updateDoctorProfile(Doctor bean) {
        doctorRepository.findById(bean.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + bean.getDoctorId()));
        return doctorRepository.save(bean);
    }

    @Override
    public AvailabilityDates addAvailability(AvailabilityDates bean) {
        return availabilityDatesRepository.save(bean);
    }

    @Override
    public AvailabilityDates updateAvailability(AvailabilityDates bean) {
        availabilityDatesRepository.findById(bean.getAvailabilityId())
                .orElseThrow(() -> new RuntimeException("Availability not found with id: " + bean.getAvailabilityId()));
        return availabilityDatesRepository.save(bean);
    }

    @Override
    public Doctor getDoctor(int doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));
    }

    @Override
    public void removeDoctor(int doctorId) {
        doctorRepository.deleteById(doctorId);
    }

    @Override
    public List<Doctor> getDoctorList() {
        return doctorRepository.findAll();
    }

    @Override
    public List<Doctor> getDoctorListBySpeciality(String speciality) {
        return doctorRepository.findBySpeciality(speciality);
    }
}
