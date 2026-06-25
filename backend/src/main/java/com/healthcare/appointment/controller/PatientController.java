package com.healthcare.appointment.controller;

import com.healthcare.appointment.entity.Patient;
import com.healthcare.appointment.service.IPatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final IPatientService patientService;

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatient());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatient(@PathVariable int id) {
        return ResponseEntity.ok(patientService.getPatient(id));
    }

    @PostMapping
    public ResponseEntity<Patient> addPatient(@RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.addPatient(patient));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable int id, @RequestBody Patient patient) {
        patient.setPatientId(id);
        return ResponseEntity.ok(patientService.updatePatientDetails(patient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable int id) {
        patientService.removePatientDetails(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-doctor/{doctorId}")
    public ResponseEntity<List<Patient>> getByDoctor(@PathVariable int doctorId) {
        return ResponseEntity.ok(patientService.getPatientListByDoctor(doctorId));
    }

    @GetMapping("/by-date")
    public ResponseEntity<List<Patient>> getByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(patientService.getPatientListByDate(date));
    }
}
