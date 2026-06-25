package com.healthcare.appointment.controller;

import com.healthcare.appointment.entity.AvailabilityDates;
import com.healthcare.appointment.entity.Doctor;
import com.healthcare.appointment.service.IDoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final IDoctorService doctorService;

    @GetMapping("/list")
    public ResponseEntity<List<Doctor>> getAllDoctors(
            @RequestParam(required = false) String speciality) {
        if (speciality != null) {
            return ResponseEntity.ok(doctorService.getDoctorListBySpeciality(speciality));
        }
        return ResponseEntity.ok(doctorService.getDoctorList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctor(@PathVariable int id) {
        return ResponseEntity.ok(doctorService.getDoctor(id));
    }

    @PostMapping
    public ResponseEntity<Doctor> addDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.addDoctor(doctor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable int id, @RequestBody Doctor doctor) {
        doctor.setDoctorId(id);
        return ResponseEntity.ok(doctorService.updateDoctorProfile(doctor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable int id) {
        doctorService.removeDoctor(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/availability")
    public ResponseEntity<AvailabilityDates> addAvailability(
            @PathVariable int id, @RequestBody AvailabilityDates availability) {
        availability.setDoctor(doctorService.getDoctor(id));
        return ResponseEntity.ok(doctorService.addAvailability(availability));
    }

    @PutMapping("/availability/{availId}")
    public ResponseEntity<AvailabilityDates> updateAvailability(
            @PathVariable int availId, @RequestBody AvailabilityDates availability) {
        availability.setAvailabilityId(availId);
        return ResponseEntity.ok(doctorService.updateAvailability(availability));
    }
}
