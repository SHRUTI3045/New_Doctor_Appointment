package com.healthcare.appointment.controller;

import com.healthcare.appointment.entity.Patient;
import com.healthcare.appointment.entity.User;
import com.healthcare.appointment.repository.UserRepository;
import com.healthcare.appointment.service.IPatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final IPatientService patientService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatient());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatient(@PathVariable int id) {
        return ResponseEntity.ok(patientService.getPatient(id));
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<Patient> getByUserId(@PathVariable int userId) {
        return ResponseEntity.ok(patientService.getPatientByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<?> addPatient(@RequestBody Patient patient) {
        String rawPassword = patient.getPassword();
        String encoded = (rawPassword != null && !rawPassword.isEmpty())
                ? passwordEncoder.encode(rawPassword) : null;

        // create a login account using email as username if not already exists
        if (patient.getEmail() != null && !userRepository.existsByUserName(patient.getEmail())) {
            User user = new User();
            user.setUserName(patient.getEmail());
            user.setPassword(encoded != null ? encoded : passwordEncoder.encode("changeme"));
            user.setRole("PATIENT");
            User saved = userRepository.save(user);
            patient.setUserId(saved.getUserId());
        }

        if (encoded != null) patient.setPassword(encoded);
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
