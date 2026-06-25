package com.healthcare.appointment.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int doctorId;

    @NotBlank
    private String doctorName;

    private String speciality;

    private String location;

    private String hospitalName;

    private String mobileNo;

    @Email
    @Column(unique = true)
    private String email;

    private String password;

    private double chargedPerVisit;
}
