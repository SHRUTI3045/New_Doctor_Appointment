package com.healthcare.appointment.service.impl;

import com.healthcare.appointment.entity.Appointment;
import com.healthcare.appointment.entity.Doctor;
import com.healthcare.appointment.entity.Patient;
import com.healthcare.appointment.repository.AppointmentRepository;
import com.healthcare.appointment.repository.DoctorRepository;
import com.healthcare.appointment.repository.PatientRepository;
import com.healthcare.appointment.service.IAppointmentService;
import com.healthcare.appointment.service.INotificationService;
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
    private final INotificationService notificationService;

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
        Appointment saved = appointmentRepository.save(app);

        Doctor doctor = doctorRepository.findById(saved.getDoctor().getDoctorId()).orElse(null);
        Patient patient = patientRepository.findById(saved.getPatient().getPatientId()).orElse(null);
        if (doctor != null && patient != null) {
            notificationService.addNotification(doctor.getUserId(),
                    "New appointment request from " + patient.getPatientName() + " on " + saved.getAppointmentDate() + ".",
                    "APPOINTMENT_BOOKED", saved.getAppointmentId());
        }
        return saved;
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
        Appointment saved = appointmentRepository.save(appointment);

        notificationService.addNotification(saved.getPatient().getUserId(),
                "Your appointment with " + saved.getDoctor().getDoctorName() + " on " + saved.getAppointmentDate()
                        + " has been " + status.toLowerCase() + ".",
                "APPOINTMENT_" + status, saved.getAppointmentId());
        return saved;
    }

    @Override
    public Appointment setPrescription(int appointmentId, String prescription) {
        Appointment app = getAppointment(appointmentId);
        app.setPrescription(prescription);
        Appointment saved = appointmentRepository.save(app);

        notificationService.addNotification(saved.getPatient().getUserId(),
                saved.getDoctor().getDoctorName() + " added a prescription for your appointment on "
                        + saved.getAppointmentDate() + ".",
                "PRESCRIPTION_ADDED", saved.getAppointmentId());
        return saved;
    }

    @Override
    public Appointment reschedule(int appointmentId, java.time.LocalDate newDate) {
        Appointment app = getAppointment(appointmentId);
        app.setAppointmentDate(newDate);
        app.setAppointmentStatus("PENDING");
        Appointment saved = appointmentRepository.save(app);

        notificationService.addNotification(saved.getDoctor().getUserId(),
                "Appointment with " + saved.getPatient().getPatientName() + " was rescheduled to " + newDate
                        + " and needs your approval.",
                "APPOINTMENT_RESCHEDULED", saved.getAppointmentId());
        return saved;
    }
}
