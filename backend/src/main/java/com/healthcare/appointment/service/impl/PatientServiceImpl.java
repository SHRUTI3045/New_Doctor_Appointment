package com.healthcare.appointment.service.impl;

import com.healthcare.appointment.entity.Doctor;
import com.healthcare.appointment.entity.Patient;
import com.healthcare.appointment.repository.AppointmentRepository;
import com.healthcare.appointment.repository.DoctorRepository;
import com.healthcare.appointment.repository.PatientRepository;
import com.healthcare.appointment.service.IPatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements IPatientService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public Patient addPatient(Patient bean) {
        return patientRepository.save(bean);
    }

    @Override
    public Patient updatePatientDetails(Patient bean) {
        patientRepository.findById(bean.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + bean.getPatientId()));
        return patientRepository.save(bean);
    }

    @Override
    public void removePatientDetails(int patientId) {
        patientRepository.deleteById(patientId);
    }

    @Override
    public Patient getPatient(int patientId) {
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
    }

    @Override
    public List<Patient> getAllPatient() {
        return patientRepository.findAll();
    }

    @Override
    public List<Patient> getPatientListByDoctor(int doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));
        return appointmentRepository.findByDoctor(doctor).stream()
                .map(a -> a.getPatient())
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public List<Patient> getPatientListByDate(LocalDate appdate) {
        return appointmentRepository.findByAppointmentDate(appdate).stream()
                .map(a -> a.getPatient())
                .distinct()
                .collect(Collectors.toList());
    }
}
