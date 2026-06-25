package com.healthcare.appointment.controller;

import com.healthcare.appointment.entity.Feedback;
import com.healthcare.appointment.service.IFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final IFeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<Feedback> submit(@RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.addFeedback(feedback));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Feedback>> getByDoctor(@PathVariable int doctorId) {
        return ResponseEntity.ok(feedbackService.getAllFeedbacksByDoctor(doctorId));
    }
}
