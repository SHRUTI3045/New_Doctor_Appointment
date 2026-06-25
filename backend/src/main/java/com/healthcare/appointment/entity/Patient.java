package com.healthcare.appointment.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int patientId;

    @NotBlank
    private String patientName;

    private String mobileNo;

    @Email
    @Column(unique = true)
    private String email;

    private String password;

    private String bloodGroup;

    private String gender;

    private int age;

    private String address;
}
