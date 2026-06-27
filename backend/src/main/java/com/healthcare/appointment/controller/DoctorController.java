package com.healthcare.appointment.controller;

import com.healthcare.appointment.entity.AvailabilityDates;
import com.healthcare.appointment.entity.Doctor;
import com.healthcare.appointment.entity.User;
import com.healthcare.appointment.repository.UserRepository;
import com.healthcare.appointment.service.IDoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final IDoctorService doctorService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.healthcare.appointment.service.IAppointmentService appointmentService;

    @GetMapping("/list")
    public ResponseEntity<List<Doctor>> getAllDoctors(
            @RequestParam(required = false) String speciality,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String location) {
        List<Doctor> all = (speciality != null)
                ? doctorService.getDoctorListBySpeciality(speciality)
                : doctorService.getDoctorList();
        return ResponseEntity.ok(all.stream()
                .filter(d -> name == null || d.getDoctorName().toLowerCase().contains(name.toLowerCase()))
                .filter(d -> location == null || (d.getLocation() != null && d.getLocation().toLowerCase().contains(location.toLowerCase())))
                .collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctor(@PathVariable int id) {
        return ResponseEntity.ok(doctorService.getDoctor(id));
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<Doctor> getByUserId(@PathVariable int userId) {
        return ResponseEntity.ok(doctorService.getDoctorByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<?> addDoctor(@RequestBody Doctor doctor) {
        String rawPassword = doctor.getPassword();
        String encoded = (rawPassword != null && !rawPassword.isEmpty())
                ? passwordEncoder.encode(rawPassword) : passwordEncoder.encode("changeme");

        // create login account using email as username
        if (doctor.getEmail() != null && !userRepository.existsByUserName(doctor.getEmail())) {
            User user = new User();
            user.setUserName(doctor.getEmail());
            user.setPassword(encoded);
            user.setRole("DOCTOR");
            User saved = userRepository.save(user);
            doctor.setUserId(saved.getUserId());
        }

        doctor.setPassword(encoded);
        return ResponseEntity.ok(doctorService.addDoctor(doctor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable int id, @RequestBody Doctor doctor) {
        doctor.setDoctorId(id);
        return ResponseEntity.ok(doctorService.updateDoctorProfile(doctor));
    }

    @GetMapping("/{id}/earnings")
    public ResponseEntity<java.util.Map<String, Object>> getEarnings(@PathVariable int id) {
        java.util.List<com.healthcare.appointment.entity.Appointment> completed =
            appointmentService.getAppointmentsByDoctor(id).stream()
                .filter(a -> "COMPLETED".equals(a.getAppointmentStatus()))
                .collect(java.util.stream.Collectors.toList());
        Doctor doctor = doctorService.getDoctor(id);
        double total = completed.size() * doctor.getChargedPerVisit();
        return ResponseEntity.ok(java.util.Map.of(
            "totalEarnings", total,
            "completedCount", completed.size(),
            "appointments", completed
        ));
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
