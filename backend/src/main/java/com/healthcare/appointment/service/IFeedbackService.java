package com.healthcare.appointment.service;

import com.healthcare.appointment.entity.Feedback;

import java.util.List;

public interface IFeedbackService {
    Feedback addFeedback(Feedback fbd);
    Feedback getFeedback(int feedbackId);
    List<Feedback> getAllFeedbacksByDoctor(int doctorId);
}
