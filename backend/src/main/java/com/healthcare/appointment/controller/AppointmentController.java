package com.healthcare.appointment.controller;

import com.healthcare.appointment.entity.Appointment;
import com.healthcare.appointment.service.IAppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final IAppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<Appointment>> getAll(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date != null) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByDate(date));
        }
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getById(@PathVariable int id) {
        return ResponseEntity.ok(appointmentService.getAppointment(id));
    }

    @PostMapping
    public ResponseEntity<Appointment> book(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.addAppointment(appointment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> update(@PathVariable int id, @RequestBody Appointment appointment) {
        appointment.setAppointmentId(id);
        return ResponseEntity.ok(appointmentService.updateAppointment(appointment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Appointment> approve(@PathVariable int id) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, "APPROVED"));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Appointment> reject(@PathVariable int id,
            @RequestBody(required = false) Map<String, String> body) {
        Appointment a = appointmentService.updateStatus(id, "REJECTED");
        if (body != null && body.containsKey("remark")) {
            a.setRemark(body.get("remark"));
            a = appointmentService.updateAppointment(a);
        }
        return ResponseEntity.ok(a);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancel(@PathVariable int id) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, "CANCELLED"));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Appointment> complete(@PathVariable int id) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, "COMPLETED"));
    }

    @PutMapping("/{id}/prescription")
    public ResponseEntity<Appointment> addPrescription(@PathVariable int id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(appointmentService.setPrescription(id, body.get("prescription")));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<Appointment> reschedule(@PathVariable int id,
            @RequestBody Map<String, String> body) {
        java.time.LocalDate newDate = java.time.LocalDate.parse(body.get("appointmentDate"));
        return ResponseEntity.ok(appointmentService.reschedule(id, newDate));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getByDoctor(@PathVariable int doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getByPatient(@PathVariable int patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }
}
