package com.healthcare.appointment.service;

import com.healthcare.appointment.entity.Doctor;
import com.healthcare.appointment.entity.Patient;

import java.time.LocalDate;
import java.util.List;

public interface IPatientService {
    Patient addPatient(Patient bean);
    Patient updatePatientDetails(Patient bean);
    void removePatientDetails(int patientId);
    Patient getPatient(int patientId);
    List<Patient> getAllPatient();
    List<Patient> getPatientListByDoctor(int doctorId);
    List<Patient> getPatientListByDate(LocalDate appdate);
    Patient getPatientByUserId(int userId);
}
