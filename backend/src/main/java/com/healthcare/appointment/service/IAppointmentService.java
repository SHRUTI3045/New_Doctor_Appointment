package com.healthcare.appointment.service;

import com.healthcare.appointment.entity.Appointment;

import java.time.LocalDate;
import java.util.List;

public interface IAppointmentService {
    List<Appointment> getAllAppointments();
    Appointment getAppointment(int appointmentId);
    Appointment addAppointment(Appointment app);
    void deleteAppointment(int appointmentId);
    Appointment updateAppointment(Appointment app);
    List<Appointment> getAppointmentsByDoctor(int doctorId);
    List<Appointment> getAppointmentsByDate(LocalDate date);
    List<Appointment> getAppointmentsByPatient(int patientId);
    Appointment updateStatus(int appointmentId, String status);
}
