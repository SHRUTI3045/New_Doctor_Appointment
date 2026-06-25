package com.healthcare.appointment.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int adminId;

    private String adminName;

    private String contactNumber;

    @Email
    @Column(unique = true)
    private String email;

    private String password;
}
