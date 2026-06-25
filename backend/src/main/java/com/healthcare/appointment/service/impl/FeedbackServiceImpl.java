package com.healthcare.appointment.service.impl;

import com.healthcare.appointment.entity.Doctor;
import com.healthcare.appointment.entity.Feedback;
import com.healthcare.appointment.repository.DoctorRepository;
import com.healthcare.appointment.repository.FeedbackRepository;
import com.healthcare.appointment.service.IFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements IFeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public Feedback addFeedback(Feedback fbd) {
        return feedbackRepository.save(fbd);
    }

    @Override
    public Feedback getFeedback(int feedbackId) {
        return feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + feedbackId));
    }

    @Override
    public List<Feedback> getAllFeedbacksByDoctor(int doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));
        return feedbackRepository.findByDoctor(doctor);
    }
}
