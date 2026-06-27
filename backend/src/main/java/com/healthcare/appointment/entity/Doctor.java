package com.healthcare.appointment.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int doctorId;

    @Column(name = "user_id")
    private Integer userId;

    @NotBlank
    private String doctorName;

    private String speciality;

    private String location;

    private String hospitalName;

    private String mobileNo;

    @Email
    @Column(unique = true)
    private String email;

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private double chargedPerVisit;
}
