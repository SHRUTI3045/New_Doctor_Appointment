package com.healthcare.appointment.controller;

import com.healthcare.appointment.entity.Appointment;
import com.healthcare.appointment.service.IAppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final IAppointmentService appointmentService;

    @GetMapping("/appointments")
    public ResponseEntity<Map<String, Object>> getAppointmentReport() {
        List<Appointment> all = appointmentService.getAllAppointments();
        Map<String, Long> byStatus = all.stream()
                .collect(Collectors.groupingBy(Appointment::getAppointmentStatus, Collectors.counting()));
        return ResponseEntity.ok(Map.of(
                "total", all.size(),
                "byStatus", byStatus,
                "appointments", all
        ));
    }
}
