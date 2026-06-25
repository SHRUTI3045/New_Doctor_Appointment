package com.healthcare.appointment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "availability_dates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityDates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int availabilityId;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    private LocalDate fromDate;

    private LocalDate endDate;
}
