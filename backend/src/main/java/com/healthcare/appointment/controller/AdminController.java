package com.healthcare.appointment.controller;

import com.healthcare.appointment.entity.Admin;
import com.healthcare.appointment.service.IAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final IAdminService adminService;
    private final com.healthcare.appointment.service.IAppointmentService appointmentService;
    private final com.healthcare.appointment.service.IDoctorService doctorService;
    private final com.healthcare.appointment.service.IPatientService patientService;

    @GetMapping
    public ResponseEntity<List<Admin>> getAll() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getById(@PathVariable int id) {
        return ResponseEntity.ok(adminService.viewAdmin(id));
    }

    @PostMapping
    public ResponseEntity<Admin> add(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.addAdmin(admin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Admin> update(@PathVariable int id, @RequestBody Admin admin) {
        admin.setAdminId(id);
        return ResponseEntity.ok(adminService.updateAdmin(admin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        adminService.removeAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<java.util.Map<String, Object>> getStats() {
        java.util.List<com.healthcare.appointment.entity.Appointment> all = appointmentService.getAllAppointments();
        java.util.Map<String, Long> byStatus = all.stream()
            .collect(java.util.stream.Collectors.groupingBy(
                a -> a.getAppointmentStatus() != null ? a.getAppointmentStatus() : "UNKNOWN",
                java.util.stream.Collectors.counting()));
        java.util.Map<String, Long> byMonth = all.stream()
            .filter(a -> a.getAppointmentDate() != null)
            .collect(java.util.stream.Collectors.groupingBy(
                a -> a.getAppointmentDate().getMonth().toString().substring(0, 3),
                java.util.stream.Collectors.counting()));
        return ResponseEntity.ok(java.util.Map.of(
            "byStatus", byStatus,
            "byMonth", byMonth,
            "totalDoctors", (long) doctorService.getDoctorList().size(),
            "totalPatients", (long) patientService.getAllPatient().size(),
            "totalAppointments", (long) all.size()
        ));
    }
}
