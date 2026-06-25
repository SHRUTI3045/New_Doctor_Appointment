package com.healthcare.appointment.service.impl;

import com.healthcare.appointment.entity.Appointment;
import com.healthcare.appointment.entity.Doctor;
import com.healthcare.appointment.entity.Patient;
import com.healthcare.appointment.repository.AppointmentRepository;
import com.healthcare.appointment.repository.DoctorRepository;
import com.healthcare.appointment.repository.PatientRepository;
import com.healthcare.appointment.service.IAppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements IAppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public Appointment getAppointment(int appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + appointmentId));
    }

    @Override
    public Appointment addAppointment(Appointment app) {
        app.setAppointmentStatus("PENDING");
        return appointmentRepository.save(app);
    }

    @Override
    public void deleteAppointment(int appointmentId) {
        appointmentRepository.deleteById(appointmentId);
    }

    @Override
    public Appointment updateAppointment(Appointment app) {
        appointmentRepository.findById(app.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + app.getAppointmentId()));
        return appointmentRepository.save(app);
    }

    @Override
    public List<Appointment> getAppointmentsByDoctor(int doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));
        return appointmentRepository.findByDoctor(doctor);
    }

    @Override
    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    @Override
    public List<Appointment> getAppointmentsByPatient(int patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        return appointmentRepository.findByPatient(patient);
    }

    @Override
    public Appointment updateStatus(int appointmentId, String status) {
        Appointment appointment = getAppointment(appointmentId);
        appointment.setAppointmentStatus(status);
        return appointmentRepository.save(appointment);
    }
}
